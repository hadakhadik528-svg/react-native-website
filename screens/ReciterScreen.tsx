import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getReciter, isSurahAvailable, reciterSurahUrl, availableSurahCount, type Reciter } from '../lib/data/reciters';
import { SURAHS, type Surah } from '../lib/data/surahs';
import { useAudio, type AudioTrack } from '../lib/audio';
import { COLORS, FONTS, RADIUS } from '../lib/theme';
import { Equalizer } from '../components/Equalizer';

type Params = { reciterId: string };

function buildSurahTrack(reciter: Reciter, n: number): AudioTrack {
  const surah = SURAHS[n - 1];
  const nextN = SURAHS.find((s) => s.n > n && isSurahAvailable(reciter, s.n))?.n;
  return {
    id: `quran-${reciter.id}-${n}`,
    type: 'quran' as const,
    title: `سورة ${surah.name}`,
    subtitle: reciter.name,
    url: reciterSurahUrl(reciter, n),
    next: nextN ? buildSurahTrack(reciter, nextN) : undefined,
  };
}

export default function ReciterScreen() {
  const route = useRoute<RouteProp<{ Reciter: Params }, 'Reciter'>>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { track, isPlaying, play } = useAudio();

  const reciter = getReciter(route.params.reciterId);
  if (!reciter) return null;

  const surahs = SURAHS.filter((s) => isSurahAvailable(reciter, s.n));

  const playSurah = (n: number) => {
    play(buildSurahTrack(reciter, n));
  };

  const activePrefix = `quran-${reciter.id}-`;
  const anyActive = track?.id.startsWith(activePrefix);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Reciter header */}
      <LinearGradient colors={reciter.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerLetter}>{reciter.name.trim().charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{reciter.name}</Text>
            <Text style={styles.headerSub}>{reciter.subtitle}</Text>
            <Text style={styles.headerMeta}>{availableSurahCount(reciter)} سورة متوفرة</Text>
          </View>
        </View>
        {anyActive ? (
          <View style={styles.nowPlaying}>
            <Equalizer color="#FFF" />
            <Text style={styles.nowPlayingText} numberOfLines={1}>
              {track?.title} — {isPlaying ? 'جارٍ التشغيل التلقائي' : 'متوقف مؤقتًا'}
            </Text>
          </View>
        ) : null}
      </LinearGradient>

      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.n)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const id = `quran-${reciter.id}-${item.n}`;
          const active = track?.id === id;
          const playing = active && isPlaying;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.row, active && styles.rowActive]}
              onPress={() => playSurah(item.n)}
            >
              <View style={[styles.numWrap, active && styles.numWrapActive]}>
                <Text style={[styles.num, active && styles.numActive]}>{item.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.surahName, active && styles.surahNameActive]}>
                  سورة {item.name}
                </Text>
                <Text style={styles.surahMeta}>
                  {item.type} • {item.ayahs} آية
                </Text>
              </View>
              <TouchableOpacity
                style={styles.readBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => navigation.navigate('Reader', { surahNumber: item.n, reciterId: reciter.id })}
              >
                <Ionicons name="book-outline" size={18} color={COLORS.gold} />
              </TouchableOpacity>
              {playing ? (
                <Equalizer />
              ) : (
                <View style={[styles.playIcon, active && styles.playIconActive]}>
                  <Ionicons name={active ? 'pause' : 'play'} size={15} color={active ? COLORS.gold : '#1A1206'} style={{ marginLeft: active ? 0 : -1.5 }} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGrad: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBack: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLetter: {
    fontFamily: FONTS.quranBold,
    fontSize: 28,
    color: '#FFF',
  },
  headerName: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: '#FFF',
  },
  headerSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerMeta: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nowPlayingText: {
    flex: 1,
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: '#FFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowActive: {
    borderColor: 'rgba(217,164,65,0.55)',
    backgroundColor: 'rgba(217,164,65,0.07)',
  },
  numWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  numWrapActive: {
    backgroundColor: 'rgba(217,164,65,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.5)',
  },
  num: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.gold,
    transform: [{ rotate: '-45deg' }],
  },
  numActive: {
    color: COLORS.goldLight,
  },
  surahName: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  surahNameActive: {
    color: COLORS.goldLight,
  },
  surahMeta: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  readBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(217,164,65,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconActive: {
    backgroundColor: 'rgba(217,164,65,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
});
