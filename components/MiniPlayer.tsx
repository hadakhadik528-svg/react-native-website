import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../lib/audio';
import { COLORS, FONTS, RADIUS, SHADOW } from '../lib/theme';
import { GradientAvatar } from './ui';

export function MiniPlayer() {
  const { track, isPlaying, isLoading, position, duration, togglePlayPause, stop } = useAudio();

  if (!track) return null;

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.row}>
        <GradientAvatar
          colors={track.type === 'adhan' ? ['#8A6D1F', '#D9A441'] : ['#155A46', '#2FA87A']}
          size={44}
          radius={14}
        >
          <Ionicons
            name={track.type === 'adhan' ? 'volume-high' : 'book'}
            size={20}
            color="#FFF"
          />
        </GradientAvatar>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {track.subtitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playBtn}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.gold} />
          ) : (
            <LinearGradient
              colors={['#C89B3C', '#E8C874']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playGradient}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#1A1206" />
            </LinearGradient>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={stop}
          style={styles.closeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={20} color={COLORS.textDim} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#123127',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressFill: {
    height: 3,
    backgroundColor: COLORS.gold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.textDim,
    marginTop: 1,
  },
  playBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
