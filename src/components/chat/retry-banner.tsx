import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

export function RetryBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <Animated.View entering={FadeInUp.duration(220)} style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>I couldn&apos;t reply just now.</Text>
      </View>
      <Pressable
        accessibilityLabel="Retry sending your message"
        accessibilityRole="button"
        style={styles.button}
        onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  text: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
