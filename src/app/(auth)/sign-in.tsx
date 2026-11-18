import { useSSO } from '@clerk/expo';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.error('Google sign-in failed', error);
    }
  }, [startSSOFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Sign in with Google to get started.</Text>
      <Pressable
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
        style={styles.button}
        onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Continue with Google</Text>
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
});
