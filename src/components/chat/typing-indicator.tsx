import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius, Spacing } from '@/theme';

const DOT_COUNT = 3;
const DOT_DELAY_STEP = 120;
const BOUNCE_DURATION = 300;
const BOUNCE_HEIGHT = Spacing.sm;

function Dot({ delay, reducedMotion }: { delay: number; reducedMotion: boolean }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      translateY.value = 0;
      return;
    }
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-BOUNCE_HEIGHT, { duration: BOUNCE_DURATION, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: BOUNCE_DURATION, easing: Easing.in(Easing.quad) })
        ),
        -1
      )
    );
  }, [delay, reducedMotion, translateY]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function TypingIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <View accessibilityLabel="Assistant is typing" style={styles.container}>
      {Array.from({ length: DOT_COUNT }).map((_, index) => (
        <Dot key={index} delay={index * DOT_DELAY_STEP} reducedMotion={reducedMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  dot: {
    width: Spacing.xs,
    height: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.text,
  },
});
