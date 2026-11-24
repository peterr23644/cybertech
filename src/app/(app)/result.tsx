import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

export default function ResultScreen() {
  const { summary, nextStep } = useLocalSearchParams<{ summary?: string; nextStep?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here&apos;s what I heard</Text>
      <Text style={styles.body}>
        {summary || "Thanks for sharing. I wasn't able to put together a summary this time."}
      </Text>

      <Text style={styles.label}>Suggested next step</Text>
      <Text style={styles.body}>
        {nextStep || 'Talk to a trusted adult, teacher, parent, or school counselor.'}
      </Text>

      <Text style={styles.note}>
        This is a supportive check-in, not a diagnosis or a legal judgment.
      </Text>

      <Pressable
        accessibilityLabel="Start over"
        accessibilityRole="button"
        style={styles.button}
        onPress={() => router.replace('/chat')}>
        <Text style={styles.buttonText}>Start over</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  body: {
    fontSize: FontSizes.md,
    color: Colors.text,
    textAlign: 'center',
  },
  note: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
