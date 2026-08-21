import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUEZZINS, type Muezzin } from '../lib/data/muezzins';
import { useAudio } from '../lib/audio';
import { COLORS, FONTS, RADIUS, SHADOW } from '../lib/theme';
import { Equalizer } from '../components/Equalizer';
import { GradientAvatar } from '../components/ui';

export default function AdhanScreen() {
  const { track, isPlaying, isLoading, play } = useAudio();

  const onPress = (m: Muezzin) => {
    const id = `adhan-${m.id}`;
    play({
      id,
      type: 'adhan',
      title: `الأذان — ${m.name}`,
      subtitle: m.subtitle,
      url: m.url,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>المؤذنون</Text>
        <Text style={styles.subtitle}>اضغط على أي مؤذن ليصدح الأذان فورًا 🕌</Text>
      </View>

      <FlatList
        data={MUEZZINS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const id = `adhan-${item.id}`;
          const active = track?.id === id;
          const playing = active && isPlaying;
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onPress(item)}
              style={[styles.card, active && styles.cardActive]}
            >
              <GradientAvatar colors={item.colors} size={58} radius={20}>
                <Ionicons name="volume-high" size={24} color="#FFF" />
              </GradientAvatar>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {item.subtitle}
                </Text>
                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>مؤذن حقيقي</Text>
                  </View>
                  {index < 6 ? (
                    <View style={styles.tagGold}>
                      <Text style={styles.tagGoldText}>مشهور</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.action}>
                {playing ? (
                  <Equalizer />
                ) : active && isLoading ? (
                  <Ionicons name="radio-button-on" size={24} color={COLORS.gold} />
                ) : (
                  <LinearGradient
                    colors={active ? ['#3A4A42', '#4A5A52'] : ['#C89B3C', '#E8C874']}
                    style={styles.playCircle}
                  >
                    <Ionicons
                      name={active ? 'pause' : 'play'}
                      size={20}
                      color={active ? COLORS.text : '#1A1206'}
                      style={{ marginLeft: active ? 0 : -2 }}
                    />
                  </LinearGradient>
                )}
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
    paddingBottom: 8,
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
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 14,
    ...SHADOW,
  },
  cardActive: {
    borderColor: 'rgba(217,164,65,0.55)',
    backgroundColor: 'rgba(217,164,65,0.07)',
  },
  info: { flex: 1 },
  name: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    color: COLORS.text,
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },
  tag: {
    backgroundColor: 'rgba(47,168,122,0.12)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(47,168,122,0.3)',
  },
  tagText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 10,
    color: COLORS.greenBright,
  },
  tagGold: {
    backgroundColor: 'rgba(217,164,65,0.12)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.35)',
  },
  tagGoldText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 10,
    color: COLORS.goldLight,
  },
  action: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
