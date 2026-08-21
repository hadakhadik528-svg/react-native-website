import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASMALA, SURAHS } from '../lib/data/surahs';
import { getReciter, isSurahAvailable, reciterSurahUrl } from '../lib/data/reciters';
import { useAudio } from '../lib/audio';
import { useSettings } from '../lib/settings';
import { COLORS, FONTS, RADIUS } from '../lib/theme';

type Params = { surahNumber: number; reciterId?: string };

interface Ayah {
  numberInSurah: number;
  text: string;
}

const BASMALA_UTHMANI = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

function toArabicDigits(n: number): string {
  const digits = '٠١٢٣٤٥٦٧٨٩';
  return String(n)
    .split('')
    .map((d) => digits[Number(d)] ?? d)
    .join('');
}

export default function ReaderScreen() {
  const route = useRoute<RouteProp<{ Reader: Params }, 'Reader'>>();
  const navigation = useNavigation();
  const { settings, update } = useSettings();
  const { play, track, isPlaying } = useAudio();

  const surahNumber = route.params.surahNumber;
  const surah = SURAHS[surahNumber - 1];
  const reciter = route.params.reciterId ? getReciter(route.params.reciterId) : undefined;

  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fontSize = settings.readerFontSize;

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
      const json = await res.json();
      if (json?.code === 200 && json?.data?.ayahs) {
        let list: Ayah[] = json.data.ayahs.map((a: any) => ({
          numberInSurah: a.numberInSurah,
          text: String(a.text).replace(/^\uFEFF/, ''),
        }));
        // Strip basmala prefix from first ayah (except Al-Fatiha & At-Tawbah)
        if (surahNumber !== 1 && surahNumber !== 9 && list.length > 0) {
          const first = list[0];
          if (first.text.startsWith(BASMALA_UTHMANI)) {
            list[0] = { ...first, text: first.text.slice(BASMALA_UTHMANI.length).trim() };
          }
        }
        setAyahs(list);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [surahNumber]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFont = (delta: number) => {
    const next = Math.max(16, Math.min(40, fontSize + delta));
    update({ readerFontSize: next });
  };

  const playSurah = () => {
    if (!reciter) return;
    const id = `quran-${reciter.id}-${surahNumber}`;
    play({
      id,
      type: 'quran',
      title: `سورة ${surah.name}`,
      subtitle: reciter.name,
      url: reciterSurahUrl(reciter, surahNumber),
    });
  };

  const trackId = reciter ? `quran-${reciter.id}-${surahNumber}` : null;
  const isThisPlaying = trackId !== null && track?.id === trackId && isPlaying;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.title}>سورة {surah.name}</Text>
          <Text style={styles.meta}>
            {surah.type} • {surah.ayahs} آية
          </Text>
        </View>
        {reciter && isSurahAvailable(reciter, surahNumber) ? (
          <TouchableOpacity style={styles.iconBtn} onPress={playSurah}>
            <Ionicons name={isThisPlaying ? 'pause' : 'play'} size={18} color={COLORS.gold} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>جارٍ تحميل السورة...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={44} color={COLORS.textFaint} />
          <Text style={styles.errorText}>تعذر تحميل نص السورة — تحقق من الاتصال بالإنترنت</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {surahNumber !== 9 ? (
            <Text style={[styles.basmala, { fontSize: fontSize + 2 }]}>{BASMALA}</Text>
          ) : null}
          <Text style={[styles.body, { fontSize, lineHeight: fontSize * 2.1 }]}>
            {ayahs?.map((a) => (
              <React.Fragment key={a.numberInSurah}>
                {a.text}
                <Text style={[styles.ayahMark, { fontSize: fontSize * 0.85 }]}>
                  {' '}﴿{toArabicDigits(a.numberInSurah)}﴾
                </Text>{' '}
              </React.Fragment>
            ))}
          </Text>
          <Text style={styles.endMark}>۞ صَدَقَ اللَّهُ الْعَظِيمُ ۞</Text>
        </ScrollView>
      )}

      {/* Font size controls */}
      <View style={styles.fontBar}>
        <TouchableOpacity
          style={styles.fontBtn}
          onPress={() => changeFont(-2)}
          disabled={fontSize <= 16}
        >
          <Text style={[styles.fontBtnLetter, { fontSize: 14 }]}>أ</Text>
          <Ionicons name="remove" size={14} color={fontSize <= 16 ? COLORS.textFaint : COLORS.gold} />
        </TouchableOpacity>
        <View style={styles.fontInfo}>
          <Text style={styles.fontLabel}>حجم خط القراءة</Text>
          <View style={styles.fontTrack}>
            <View style={[styles.fontFill, { width: `${((fontSize - 16) / 24) * 100}%` }]} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.fontBtn}
          onPress={() => changeFont(2)}
          disabled={fontSize >= 40}
        >
          <Text style={[styles.fontBtnLetter, { fontSize: 22 }]}>أ</Text>
          <Ionicons name="add" size={14} color={fontSize >= 40 ? COLORS.textFaint : COLORS.gold} />
        </TouchableOpacity>
      </View>
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
    fontFamily: FONTS.quranBold,
    fontSize: 19,
    color: COLORS.goldLight,
  },
  meta: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 14,
  },
  loadingText: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
  },
  errorText: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: '#1A1206',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  basmala: {
    fontFamily: FONTS.quranBold,
    color: COLORS.goldLight,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  body: {
    fontFamily: FONTS.quran,
    color: COLORS.text,
    textAlign: 'justify',
    writingDirection: 'rtl',
  },
  ayahMark: {
    color: COLORS.gold,
    fontFamily: FONTS.quranBold,
  },
  endMark: {
    fontFamily: FONTS.quranBold,
    fontSize: 16,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 26,
  },
  fontBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fontBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: 62,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    justifyContent: 'center',
  },
  fontBtnLetter: {
    fontFamily: FONTS.quranBold,
    color: COLORS.text,
  },
  fontInfo: { flex: 1, gap: 5 },
  fontLabel: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.textDim,
    textAlign: 'center',
  },
  fontTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fontFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
});
