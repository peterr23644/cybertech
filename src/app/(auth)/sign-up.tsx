import { useSignUp } from '@clerk/expo';
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

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const submitting = fetchStatus === 'fetching';

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = useCallback(async () => {
    if (submitting) return;
    setError('');

    const { error: passwordError } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (passwordError) {
      console.error('Sign up failed', passwordError.code);
      setError(getClerkErrorMessage(passwordError, 'Could not sign up. Please check your details and try again.'));
      return;
    }

    const { error: sendCodeError } = await signUp.verifications.sendEmailCode();

    if (sendCodeError) {
      console.error('Sending verification code failed', sendCodeError.code);
      setError(getClerkErrorMessage(sendCodeError, 'Could not send a verification code. Please try again.'));
      return;
    }

    setPendingVerification(true);
  }, [signUp, emailAddress, password, submitting]);

  const handleVerify = useCallback(async () => {
    if (submitting) return;
    setError('');

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (verifyError) {
      console.error('Verification failed', verifyError.code);
      setError(getClerkErrorMessage(verifyError, 'That code did not work. Please try again.'));
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
    } else {
      setError('That code did not work. Please try again.');
    }
  }, [signUp, code, submitting]);

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to {emailAddress}. Enter it below.
        </Text>

        <TextInput
          accessibilityLabel="Verification code"
          style={styles.input}
          placeholder="Verification code"
          placeholderTextColor={Colors.text}
          autoCapitalize="none"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          accessibilityLabel="Verify code"
          accessibilityRole="button"
          style={styles.button}
          onPress={handleVerify}
          disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Verifying...' : 'Verify'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create an account to get started.</Text>

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
        autoComplete="password-new"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.hint}>Use at least 15 characters.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        accessibilityLabel="Sign up"
        accessibilityRole="button"
        style={styles.button}
        onPress={handleSignUp}
        disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Signing up...' : 'Sign up'}</Text>
      </Pressable>

      <Link href="/sign-in" style={styles.link}>
        <Text accessibilityLabel="Go to sign in" style={styles.linkText}>
          Already have an account? Sign in
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
  hint: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    opacity: 0.7,
    alignSelf: 'flex-start',
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
