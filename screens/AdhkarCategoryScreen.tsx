import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCategory, TASBIH_PHRASES } from '../lib/data/adhkar';
import { useSettings } from '../lib/settings';
import { COLORS, FONTS, RADIUS, SHADOW } from '../lib/theme';

type Params = { categoryId: string };

function toArabicDigits(n: number): string {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return String(n)
    .split('')
    .map((d) => digits[Number(d)] ?? d)
    .join('');
}

function TasbihView({ fontSize }: { fontSize: number }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const tap = () => {
    Vibration.vibrate(15);
    setCount((c) => {
      const next = c + 1;
      if (target > 0 && next === target) {
        Vibration.vibrate([40, 60, 40]);
      }
      return next;
    });
  };

  const progress = target > 0 ? Math.min(1, count / target) : 0;

  return (
    <View style={tasbih.wrap}>
      <View style={tasbih.phraseRow}>
        {TASBIH_PHRASES.map((p, i) => (
          <TouchableOpacity
            key={p}
            style={[tasbih.phraseChip, i === phraseIdx && tasbih.phraseChipActive]}
            onPress={() => {
              setPhraseIdx(i);
              setCount(0);
            }}
          >
            <Text style={[tasbih.phraseChipText, i === phraseIdx && tasbih.phraseChipTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={tap} style={tasbih.bigBtnOuter}>
        <LinearGradient
          colors={['#C89B3C', '#E8C874']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={tasbih.bigBtn}
        >
          <Text style={tasbih.bigCount}>{toArabicDigits(count)}</Text>
          <Text style={tasbih.bigPhrase}>{TASBIH_PHRASES[phraseIdx]}</Text>
          {target > 0 ? (
            <Text style={tasbih.bigTarget}>من {toArabicDigits(target)}</Text>
          ) : (
            <Text style={tasbih.bigTarget}>تسبيح حر</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={tasbih.progressTrack}>
        <View style={[tasbih.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={tasbih.targetRow}>
        {[33, 99, 100, 0].map((t) => (
          <TouchableOpacity
            key={String(t)}
            style={[tasbih.targetChip, target === t && tasbih.targetChipActive]}
            onPress={() => {
              setTarget(t);
              setCount(0);
            }}
          >
            <Text style={[tasbih.targetText, target === t && tasbih.targetTextActive]}>
              {t === 0 ? '∞' : toArabicDigits(t)}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={tasbih.resetBtn}
          onPress={() => {
            setCount(0);
            Vibration.vibrate(20);
          }}
        >
          <Ionicons name="refresh" size={18} color={COLORS.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdhkarCategoryScreen() {
  const route = useRoute<RouteProp<{ AdhkarCategory: Params }, 'AdhkarCategory'>>();
  const navigation = useNavigation();
  const { settings, update } = useSettings();
  const category = getCategory(route.params.categoryId);

  const [counts, setCounts] = useState<Record<number, number>>({});

  const fontSize = settings.readerFontSize;

  const doneCount = useMemo(() => {
    if (!category) return 0;
    return category.items.filter((it, i) => (counts[i] ?? 0) >= it.count).length;
  }, [category, counts]);

  if (!category) return null;

  const tapDhikr = (index: number) => {
    const item = category.items[index];
    const current = counts[index] ?? 0;
    if (current >= item.count) return;
    const next = current + 1;
    setCounts((c) => ({ ...c, [index]: next }));
    if (next >= item.count) {
      Vibration.vibrate([30, 50, 30]);
    } else {
      Vibration.vibrate(15);
    }
  };

  const changeFont = (delta: number) => {
    update({ readerFontSize: Math.max(16, Math.min(40, fontSize + delta)) });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.title}>{category.name}</Text>
          {!category.tasbih ? (
            <Text style={styles.progressLabel}>
              أنجزت {toArabicDigits(doneCount)} من {toArabicDigits(category.items.length)}
            </Text>
          ) : null}
        </View>
        <View style={styles.fontControls}>
          <TouchableOpacity style={styles.fontMini} onPress={() => changeFont(-2)}>
            <Ionicons name="remove" size={14} color={COLORS.gold} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fontMini} onPress={() => changeFont(2)}>
            <Ionicons name="add" size={14} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {!category.tasbih && doneCount > 0 ? (
        <TouchableOpacity
          style={styles.resetAll}
          onPress={() => {
            setCounts({});
            Vibration.vibrate(20);
          }}
        >
          <Ionicons name="refresh" size={15} color={COLORS.gold} />
          <Text style={styles.resetAllText}>إعادة تعيين الأذكار</Text>
        </TouchableOpacity>
      ) : null}

      {category.tasbih ? (
        <TasbihView fontSize={fontSize} />
      ) : (
        <FlatList
          data={category.items}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const current = counts[index] ?? 0;
            const done = current >= item.count;
            const progress = Math.min(1, current / item.count);
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.dhikrCard, done && styles.dhikrCardDone]}
                onPress={() => tapDhikr(index)}
              >
                <Text style={[styles.dhikrText, { fontSize, lineHeight: fontSize * 2 }, done && styles.dhikrTextDone]}>
                  {item.text}
                </Text>
                {item.virtue ? <Text style={styles.virtue}>✦ {item.virtue}</Text> : null}
                <View style={styles.dhikrFooter}>
                  <View style={[styles.countChip, done && styles.countChipDone]}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'repeat'}
                      size={14}
                      color={done ? COLORS.greenBright : COLORS.gold}
                    />
                    <Text style={[styles.countChipText, done && styles.countChipTextDone]}>
                      {done ? 'تم بحمد الله' : `${toArabicDigits(current)} من ${toArabicDigits(item.count)}`}
                    </Text>
                  </View>
                  {!done ? (
                    <Text style={styles.tapHint}>اضغط للتسبيح</Text>
                  ) : null}
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }, done && styles.progressFillDone]} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgSoft },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.goldLight,
  },
  progressLabel: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  fontControls: {
    flexDirection: 'row',
    gap: 6,
  },
  fontMini: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(217,164,65,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.25)',
  },
  resetAllText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: COLORS.goldLight,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 12,
  },
  dhikrCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 16,
    ...SHADOW,
  },
  dhikrCardDone: {
    borderColor: 'rgba(47,168,122,0.5)',
    backgroundColor: 'rgba(47,168,122,0.05)',
  },
  dhikrText: {
    fontFamily: FONTS.quran,
    color: COLORS.text,
    textAlign: 'justify',
  },
  dhikrTextDone: {
    color: COLORS.textDim,
  },
  virtue: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.gold,
    marginTop: 8,
  },
  dhikrFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(217,164,65,0.1)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.3)',
  },
  countChipDone: {
    backgroundColor: 'rgba(47,168,122,0.12)',
    borderColor: 'rgba(47,168,122,0.4)',
  },
  countChipText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: COLORS.goldLight,
  },
  countChipTextDone: {
    color: COLORS.greenBright,
  },
  tapHint: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: COLORS.textFaint,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  progressFillDone: {
    backgroundColor: COLORS.greenBright,
  },
});

const tasbih = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  phraseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 18,
  },
  phraseChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  phraseChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(217,164,65,0.12)',
  },
  phraseChipText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: COLORS.textDim,
  },
  phraseChipTextActive: {
    color: COLORS.goldLight,
  },
  bigBtnOuter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bigBtn: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  bigCount: {
    fontFamily: FONTS.uiBold,
    fontSize: 56,
    color: '#1A1206',
  },
  bigPhrase: {
    fontFamily: FONTS.quranBold,
    fontSize: 19,
    color: '#3A2A0A',
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bigTarget: {
    fontFamily: FONTS.uiMedium,
    fontSize: 13,
    color: 'rgba(58,42,10,0.7)',
    marginTop: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  targetChip: {
    width: 52,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(217,164,65,0.12)',
  },
  targetText: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.textDim,
  },
  targetTextActive: {
    color: COLORS.goldLight,
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
