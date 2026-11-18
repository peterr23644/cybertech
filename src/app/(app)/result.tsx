import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSizes, Spacing } from '@/theme';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <Text style={styles.subtitle}>
        Placeholder summary. A plain-language explanation and a suggested next step will show
        here.
      </Text>
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
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    textAlign: 'center',
  },
});
