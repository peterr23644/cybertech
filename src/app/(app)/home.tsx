import { useClerk } from '@clerk/expo';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

export default function HomeScreen() {
  const { signOut } = useClerk();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/sign-in');
  }, [signOut]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Let&apos;s do a short, friendly self-check together.
      </Text>
      <Pressable
        accessibilityLabel="Start the self-check"
        accessibilityRole="button"
        style={styles.button}
        onPress={() => router.push('/chat')}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Sign out"
        accessibilityRole="button"
        style={styles.signOutButton}
        onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
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
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    textAlign: 'center',
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
  signOutButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
