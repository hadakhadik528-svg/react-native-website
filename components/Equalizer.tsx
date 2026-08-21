import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../lib/theme';

function Bar({ delay, color }: { delay: number; color: string }) {
  const h = useSharedValue(6);

  useEffect(() => {
    h.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(18, { duration: 320 }),
          withTiming(7, { duration: 320 }),
          withTiming(14, { duration: 320 }),
          withTiming(6, { duration: 320 })
        ),
        -1,
        false
      )
    );
    return () => {
      h.value = 6;
    };
  }, [delay, h]);

  const style = useAnimatedStyle(() => ({
    height: h.value,
  }));

  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

export function Equalizer({ color = COLORS.gold }: { color?: string }) {
  return (
    <View style={styles.wrap}>
      <Bar delay={0} color={color} />
      <Bar delay={150} color={color} />
      <Bar delay={300} color={color} />
      <Bar delay={450} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 22,
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
  },
});
