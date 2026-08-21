import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS } from '../lib/theme';

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.ornament} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function GradientAvatar({
  colors,
  children,
  size = 56,
  radius = 18,
  style,
}: {
  colors: [string, string];
  children: React.ReactNode;
  size?: number;
  radius?: number;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

export function GoldBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ornament: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 19,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 4,
    paddingRight: 14,
  },
  badge: {
    backgroundColor: 'rgba(217, 164, 65, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.4)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11,
    color: COLORS.goldLight,
  },
});
