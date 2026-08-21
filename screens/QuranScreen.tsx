import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RECITERS, availableSurahCount, reciterSurahUrl, isSurahAvailable, type Reciter } from '../lib/data/reciters';
import { SURAHS } from '../lib/data/surahs';
import { useAudio, type AudioTrack } from '../lib/audio';
import { COLORS, FONTS, RADIUS, SHADOW } from '../lib/theme';
import { Equalizer } from '../components/Equalizer';

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

export default function QuranScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { track, isPlaying, play } = useAudio();
  const [query, setQuery] = useState('');

  const reciters = useMemo(() => {
    const q = query.trim();
    if (!q) return RECITERS;
    return RECITERS.filter((r) => r.name.includes(q));
  }, [query]);

  const openReciter = (reciter: Reciter) => {
    // Auto-play immediately on tap (Surah Al-Fatiha or first available)
    const first = SURAHS.find((s) => isSurahAvailable(reciter, s.n));
    if (first) {
      play(buildSurahTrack(reciter, first.n));
    }
    navigation.navigate('Reciter', { reciterId: reciter.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>القرآن الكريم</Text>
        <Text style={styles.subtitle}>اضغط على أي قارئ لتبدأ التلاوة تلقائيًا</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={COLORS.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن قارئ... مثل إسلام صبحي"
          placeholderTextColor={COLORS.textFaint}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={reciters}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const activePrefix = `quran-${item.id}-`;
          const active = track?.id.startsWith(activePrefix);
          const playing = active && isPlaying;
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => openReciter(item)}
            >
              <LinearGradient
                colors={item.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarLetter}>{item.name.trim().charAt(0)}</Text>
                {playing ? (
                  <View style={styles.eqWrap}>
                    <Equalizer color="#FFF" />
                  </View>
                ) : null}
              </LinearGradient>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.sub} numberOfLines={1}>
                {item.subtitle}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.surahCount}>{availableSurahCount(item)} سورة</Text>
                <View style={[styles.miniPlay, playing && styles.miniPlayActive]}>
                  <Ionicons name={playing ? 'pause' : 'play'} size={13} color={playing ? COLORS.gold : '#1A1206'} style={{ marginLeft: playing ? 0 : -1.5 }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 24,
    color: COLORS.goldLight,
  },
  subtitle: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: 14.5,
    color: COLORS.text,
    padding: 0,
  },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 14,
    alignItems: 'center',
    ...SHADOW,
  },
  cardActive: {
    borderColor: 'rgba(217,164,65,0.55)',
    backgroundColor: 'rgba(217,164,65,0.06)',
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarLetter: {
    fontFamily: FONTS.quranBold,
    fontSize: 32,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  eqWrap: {
    position: 'absolute',
    bottom: 6,
  },
  name: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: COLORS.text,
    textAlign: 'center',
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  surahCount: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11,
    color: COLORS.textFaint,
  },
  miniPlay: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayActive: {
    backgroundColor: 'rgba(217,164,65,0.2)',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
});
