import { useSignIn } from '@clerk/expo';
import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';
import { getClerkErrorMessage } from '@/utils/clerkError';

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const submitting = fetchStatus === 'fetching';

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = useCallback(async () => {
    if (submitting) return;
    setError('');

    const { error: signInError } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (signInError) {
      console.error('Sign in failed', signInError.code);
      setError(getClerkErrorMessage(signInError, 'Could not sign in. Please check your email and password.'));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
    } else {
      setError('Could not sign in. Please check your details and try again.');
    }
  }, [signIn, emailAddress, password, submitting]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Welcome back! Enter your details to continue.</Text>

      <TextInput
        accessibilityLabel="Email address"
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={Colors.text}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />
      <TextInput
        accessibilityLabel="Password"
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.text}
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        accessibilityLabel="Sign in"
        accessibilityRole="button"
        style={styles.button}
        onPress={handleSignIn}
        disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Signing in...' : 'Sign in'}</Text>
      </Pressable>

      <Link href="/forgot-password" style={styles.link}>
        <Text accessibilityLabel="Go to forgot password" style={styles.linkText}>
          Forgot password?
        </Text>
      </Link>

      <Link href="/sign-up" style={styles.link}>
        <Text accessibilityLabel="Go to sign up" style={styles.linkText}>
          Don&apos;t have an account? Sign up
        </Text>
      </Link>
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
  input: {
    width: '100%',
    minHeight: 44,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  error: {
    color: '#D64545',
    fontSize: FontSizes.sm,
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
    marginTop: Spacing.md,
    width: '100%',
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  link: {
    marginTop: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
});
