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

export default function ForgotPasswordScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const submitting = fetchStatus === 'fetching';

  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [pendingReset, setPendingReset] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = useCallback(async () => {
    if (submitting) return;
    setError('');

    const { error: createError } = await signIn.create({ identifier: emailAddress.trim() });

    if (createError) {
      console.error('Starting password reset failed', createError.code);
      setError(
        getClerkErrorMessage(
          createError,
          'Could not find that account. Please check your email and try again.',
        ),
      );
      return;
    }

    const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();

    if (sendCodeError) {
      console.error('Sending reset code failed', sendCodeError.code);
      setError(getClerkErrorMessage(sendCodeError, 'Could not send a reset code. Please try again.'));
      return;
    }

    setPendingReset(true);
  }, [signIn, emailAddress, submitting]);

  const handleResetPassword = useCallback(async () => {
    if (submitting) return;
    setError('');

    const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({
      code: code.trim(),
    });

    if (verifyError) {
      console.error('Verifying reset code failed', verifyError.code);
      setError(getClerkErrorMessage(verifyError, 'That code did not work. Please try again.'));
      return;
    }

    const { error: submitError } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });

    if (submitError) {
      console.error('Setting new password failed', submitError.code);
      setError(
        getClerkErrorMessage(submitError, 'Could not set your new password. Please try again.'),
      );
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      setSuccess(true);
    } else {
      setError('Could not set your new password. Please try again.');
    }
  }, [signIn, code, password, submitting]);

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Password updated</Text>
        <Text style={styles.subtitle}>You&apos;re signed in with your new password.</Text>
      </View>
    );
  }

  if (pendingReset) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a reset code to {emailAddress}. Enter it below with your new password.
        </Text>

        <TextInput
          accessibilityLabel="Reset code"
          style={styles.input}
          placeholder="Reset code"
          placeholderTextColor={Colors.text}
          autoCapitalize="none"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        <TextInput
          accessibilityLabel="New password"
          style={styles.input}
          placeholder="New password"
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
          accessibilityLabel="Set new password"
          accessibilityRole="button"
          style={styles.button}
          onPress={handleResetPassword}
          disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Saving...' : 'Set new password'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we&apos;ll send you a code to reset your password.
      </Text>

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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        accessibilityLabel="Send reset code"
        accessibilityRole="button"
        style={styles.button}
        onPress={handleSendCode}
        disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send reset code'}</Text>
      </Pressable>

      <Link href="/sign-in" style={styles.link}>
        <Text accessibilityLabel="Back to sign in" style={styles.linkText}>
          Back to sign in
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
