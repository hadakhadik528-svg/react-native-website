import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../lib/settings';
import { getCity, getCountry } from '../lib/data/locations';
import {
  cityDateParts,
  computePrayerTimes,
  formatClock,
  formatCountdown,
  getNextPrayer,
  gregorianDate,
  hijriDate,
} from '../lib/prayer';

function useDayKey(city: any, now: number): string {
  return useMemo(() => {
    const p = cityDateParts(city, now);
    return `${p.y}-${p.m}-${p.d}`;
  }, [city, Math.floor(now / 60000)]);
}
import { useAudio } from '../lib/audio';
import { getMuezzin } from '../lib/data/muezzins';
import { COLORS, FONTS, GRADIENTS, RADIUS, SHADOW } from '../lib/theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { settings } = useSettings();
  const { play, track, isPlaying } = useAudio();
  const [now, setNow] = useState(() => Date.now());
  const triggeredRef = useRef<Set<string>>(new Set());

  const country = getCountry(settings.countryId);
  const city = getCity(settings.countryId, settings.cityId);
  const dayKey = useDayKey(city, now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const prayers = useMemo(
    () => computePrayerTimes(city, settings.methodKey, country.method, settings.adjustments, 0, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [city, settings.methodKey, country.method, settings.adjustments, dayKey]
  );

  const next = useMemo(
    () => getNextPrayer(city, settings.methodKey, country.method, settings.adjustments, now),
    [city, settings.methodKey, country.method, settings.adjustments, now]
  );

  // Auto-adhan when a prayer time arrives while the app is open
  useEffect(() => {
    if (!settings.autoAdhan) return;
    const parts = cityDateParts(city, now);
    for (const p of prayers) {
      if (p.key === 'sunrise') continue;
      const diff = now - p.time.getTime();
      const tag = `${parts.y}-${parts.m}-${parts.d}-${p.key}`;
      if (diff >= 0 && diff < 3000 && !triggeredRef.current.has(tag)) {
        triggeredRef.current.add(tag);
        const m = getMuezzin(settings.autoAdhanMuezzinId) ?? getMuezzin('alafasy-dubai');
        if (m) {
          play({
            id: `adhan-${m.id}`,
            type: 'adhan',
            title: `أذان ${p.name} — ${m.name}`,
            subtitle: city.name,
            url: m.url,
          });
        }
      }
    }
  }, [now, prayers, settings.autoAdhan, settings.autoAdhanMuezzinId, city, play]);

  const hijri = useMemo(() => hijriDate(now), [now]);
  const gregorian = useMemo(() => gregorianDate(now), [now]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.appName}>صدقة جارية</Text>
            <Text style={styles.dateLine}>{gregorian}</Text>
            {hijri ? <Text style={styles.hijri}>{hijri} هـ</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.cityChip}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CityPicker')}
          >
            <Ionicons name="location" size={16} color={COLORS.gold} />
            <Text style={styles.cityChipText} numberOfLines={1}>
              {city.name}
            </Text>
            <Text style={styles.cityChipCountry} numberOfLines={1}>
              {country.flag} {country.name}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next prayer hero card */}
        <LinearGradient colors={GRADIENTS.hero} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.hero}>
          <View style={styles.heroInner}>
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>
                {next.isTomorrow ? 'الصلاة القادمة — غدًا' : 'الصلاة القادمة'}
              </Text>
              <View style={styles.heroNameWrap}>
                <Ionicons name={next.item.icon as any} size={18} color={COLORS.goldLight} />
                <Text style={styles.heroName}>{next.item.name}</Text>
              </View>
            </View>
            <Text style={styles.countdown}>{formatCountdown(next.remainingMs)}</Text>
            <View style={styles.heroBottom}>
              <View style={styles.heroTimeWrap}>
                <Ionicons name="time-outline" size={15} color={COLORS.textDim} />
                <Text style={styles.heroTime}>
                  موعد الأذان: {formatClock(next.item.time, city)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.heroOrnament} pointerEvents="none">
            <Ionicons name="moon-outline" size={130} color="rgba(217,164,65,0.07)" />
          </View>
        </LinearGradient>

        {/* Prayer times list */}
        <View style={styles.sectionHead}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>مواقيت الصلاة اليوم</Text>
          <Text style={styles.sectionHint}>بتوقيت {city.name}</Text>
        </View>

        <View style={styles.prayerList}>
          {prayers.map((p) => {
            const isNext = p.key === next.item.key;
            const passed = p.time.getTime() <= now && !isNext;
            return (
              <View
                key={p.key}
                style={[
                  styles.prayerRow,
                  isNext && styles.prayerRowActive,
                  passed && styles.prayerRowPassed,
                ]}
              >
                <View style={[styles.prayerIcon, isNext && styles.prayerIconActive]}>
                  <Ionicons
                    name={p.icon as any}
                    size={18}
                    color={isNext ? '#1A1206' : passed ? COLORS.textFaint : COLORS.gold}
                  />
                </View>
                <Text style={[styles.prayerName, passed && styles.prayerNamePassed]}>{p.name}</Text>
                {isNext ? (
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>التالية</Text>
                  </View>
                ) : null}
                <Text style={[styles.prayerTime, isNext && styles.prayerTimeActive, passed && styles.prayerNamePassed]}>
                  {formatClock(p.time, city)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quick actions */}
        <View style={styles.sectionHead}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>وصول سريع</Text>
        </View>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdhanTab')}
          >
            <LinearGradient colors={['#8A6D1F', '#D9A441']} style={styles.quickIcon}>
              <Ionicons name="volume-high" size={22} color="#1A1206" />
            </LinearGradient>
            <Text style={styles.quickLabel}>استمع للأذان</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('QuranTab')}
          >
            <LinearGradient colors={['#155A46', '#2FA87A']} style={styles.quickIcon}>
              <Ionicons name="book" size={22} color="#FFF" />
            </LinearGradient>
            <Text style={styles.quickLabel}>القرآن الكريم</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdhkarTab', { screen: 'AdhkarCategory', params: { categoryId: 'morning' } })}
          >
            <LinearGradient colors={['#2A3A6E', '#6A8AC9']} style={styles.quickIcon}>
              <Ionicons name="leaf" size={22} color="#FFF" />
            </LinearGradient>
            <Text style={styles.quickLabel}>أذكار الصباح</Text>
          </TouchableOpacity>
        </View>

        {/* Auto adhan status */}
        {settings.autoAdhan ? (
          <View style={styles.autoNote}>
            <Ionicons name="notifications" size={16} color={COLORS.gold} />
            <Text style={styles.autoNoteText}>
              التشغيل التلقائي للأذان مفعّل — سيصدح الأذان عند دخول وقت الصلاة
            </Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا»
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  appName: {
    fontFamily: FONTS.quranBold,
    fontSize: 26,
    color: COLORS.goldLight,
  },
  dateLine: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  hijri: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12.5,
    color: COLORS.gold,
    marginTop: 1,
  },
  cityChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    maxWidth: 150,
    gap: 1,
  },
  cityChipText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.text,
  },
  cityChipCountry: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: COLORS.textDim,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.35)',
    overflow: 'hidden',
    ...SHADOW,
  },
  heroInner: { padding: 22 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontFamily: FONTS.uiMedium,
    fontSize: 13,
    color: COLORS.textDim,
  },
  heroNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(217,164,65,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.35)',
  },
  heroName: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.goldLight,
  },
  countdown: {
    fontFamily: FONTS.uiBold,
    fontSize: 52,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 2,
  },
  heroBottom: { alignItems: 'center' },
  heroTimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTime: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
  },
  heroOrnament: {
    position: 'absolute',
    top: -20,
    left: -20,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
    gap: 8,
  },
  sectionBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  sectionTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 17,
    color: COLORS.text,
    flex: 1,
  },
  sectionHint: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.textFaint,
  },
  prayerList: {
    marginHorizontal: 20,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: 'hidden',
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSoft,
    gap: 12,
  },
  prayerRowActive: {
    backgroundColor: 'rgba(217,164,65,0.09)',
  },
  prayerRowPassed: {
    opacity: 0.55,
  },
  prayerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(217,164,65,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerIconActive: {
    backgroundColor: COLORS.gold,
  },
  prayerName: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    color: COLORS.text,
    flex: 1,
  },
  prayerNamePassed: {
    color: COLORS.textFaint,
  },
  nextBadge: {
    backgroundColor: 'rgba(217,164,65,0.18)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.4)',
  },
  nextBadgeText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 10.5,
    color: COLORS.goldLight,
  },
  prayerTime: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  prayerTimeActive: {
    color: COLORS.goldLight,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: COLORS.textDim,
  },
  autoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(217,164,65,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.25)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  autoNoteText: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.goldLight,
  },
  footer: {
    fontFamily: FONTS.quran,
    fontSize: 15,
    color: COLORS.textFaint,
    textAlign: 'center',
    marginTop: 28,
    marginHorizontal: 30,
  },
});
