import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, InlineError, PinInput, Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { isValidOtp } from '@/lib/validation/auth';
import { Spacing } from '@/theme/tokens';

const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const params = useLocalSearchParams<{ verificationId?: string }>();
  const { signIn } = useAuth();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verificationId = params.verificationId;

  const verify = async () => {
    if (!verificationId) {
      setError('This verification session has expired. Please sign up again.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const session = await authApi.verifyOtp({ verificationId, code });
      signIn(session);
      router.replace(session.user.pinSet ? '/' : '/pin-setup');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (!verificationId) {
      setError('This verification session has expired. Please sign up again.');
      return;
    }
    setResending(true);
    setError(null);
    try {
      await authApi.resendOtp(verificationId);
      setSeconds(RESEND_SECONDS);
      setCode('');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen
      title="Verify your number"
      subtitle="Enter the 6-digit code we sent to your phone"
      back>
      <View style={styles.form}>
        <InlineError message={error} />
        <PinInput
          length={6}
          value={code}
          onChange={setCode}
          label="Verification code"
          autoFocus
        />
        <Button
          label="Verify code"
          loading={submitting}
          disabled={submitting || !isValidOtp(code)}
          onPress={verify}
        />
      </View>

      <View style={styles.footer}>
        {seconds > 0 ? (
          <Text variant="small" color="textSecondary">
            Resend code in {seconds}s
          </Text>
        ) : (
          <Button label="Resend code" variant="ghost" loading={resending} onPress={resend} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});