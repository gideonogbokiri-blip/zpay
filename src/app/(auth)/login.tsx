import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, InlineError, Input, Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { isValidOtp } from '@/lib/validation/auth';
import { useSecurityPreferences } from '@/state/security';
import { Spacing } from '@/theme/tokens';
import { z } from 'zod';

const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

type Step = 'phone' | 'otp';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const [step, setStep] = useState<Step>('phone');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [seconds, setSeconds] = useState(30);

  const {
    control,
    handleSubmit,
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const startTimer = () => {
    setSeconds(30);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const onRequestOtp = async (values: PhoneFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await authApi.requestOtp(values.phone);
      setVerificationId(result.verificationId);
      setPhone(values.phone);
      setStep('otp');
      startTimer();
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!verificationId || !isValidOtp(otp)) return;
    setSubmitting(true);
    setError(null);
    try {
      const session = await authApi.verifyOtp({ verificationId, code: otp });
      signIn(session);
      recordSecurityEvent({
        type: 'otp_login',
        title: 'Phone OTP login',
        detail: session.user.phone,
      });
      router.replace(session.user.pinSet ? '/(tabs)' : '/pin-setup');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!verificationId) return;
    setSubmitting(true);
    setError(null);
    try {
      await authApi.resendOtp(verificationId);
      setOtp('');
      startTimer();
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen title={undefined} scroll={false} contentStyle={styles.content}>
      <View style={styles.hero}>
        <ZpayMark size={88} />
        <Text variant="display" style={styles.logoText}>
          ZPAY
        </Text>
        <Text variant="body" color="textSecondary" style={styles.tagline}>
          Pay bills, buy airtime and register for exams in one place.
        </Text>
      </View>

      {step === 'phone' ? (
        <View style={styles.form}>
          <Text variant="title" style={styles.formTitle}>
            Get started
          </Text>
          <Text variant="small" color="textSecondary" style={styles.formSubtitle}>
            Enter your phone number to continue
          </Text>
          <InlineError message={error} />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="Phone number"
                placeholder="0801 234 5678"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={undefined}
              />
            )}
          />
          <Button
            label="Continue"
            loading={submitting}
            disabled={submitting}
            onPress={handleSubmit(onRequestOtp)}
          />
        </View>
      ) : (
        <View style={styles.form}>
          <Text variant="title" style={styles.formTitle}>
            Verify your number
          </Text>
          <Text variant="small" color="textSecondary" style={styles.formSubtitle}>
            Enter the 6-digit code sent to {phone}
          </Text>
          <InlineError message={error} />
          <View style={styles.otpRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  {
                    borderColor:
                      otp.length === i
                        ? '#00e5ff'
                        : otp.length > i
                          ? 'rgba(0,229,255,0.4)'
                          : 'rgba(255,255,255,0.1)',
                    backgroundColor: otp.length > i ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.04)',
                  },
                ]}>
                <Text variant="title" style={{ color: otp.length > i ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
                  {otp[i] || ''}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.otpInputRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={styles.otpInputWrapper}>
                <Input
                  value={otp[i] || ''}
                  onChangeText={(text) => {
                    const digit = text.replace(/\D/g, '').slice(-1);
                    const newOtp = otp.split('');
                    newOtp[i] = digit;
                    const joined = newOtp.join('').slice(0, 6);
                    setOtp(joined);
                    if (digit && i < 5) {
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpHiddenInput}
                />
              </View>
            ))}
          </View>
          <Button
            label="Verify"
            loading={submitting}
            disabled={submitting || !isValidOtp(otp)}
            onPress={onVerifyOtp}
          />
          {seconds > 0 ? (
            <Text variant="small" color="textSecondary" style={styles.resendText}>
              Resend code in {seconds}s
            </Text>
          ) : (
            <Button
              label="Resend code"
              variant="ghost"
              loading={submitting}
              onPress={onResend}
            />
          )}
          <Button
            label="Change number"
            variant="ghost"
            onPress={() => {
              setStep('phone');
              setOtp('');
              setError(null);
            }}
          />
        </View>
      )}

      <View style={styles.footer}>
        <Text variant="small" color="textSecondary">
          Don&apos;t have an account?{' '}
          <Link href="/signup">
            <Text variant="smallBold" color="accent">
              Sign up
            </Text>
          </Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  logoText: {
    letterSpacing: 4,
  },
  tagline: {
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  form: {
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  formTitle: {
    marginBottom: Spacing.xxs,
  },
  formSubtitle: {
    marginBottom: Spacing.sm,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    opacity: 0,
  },
  otpInputWrapper: {
    width: 48,
    height: 56,
  },
  otpHiddenInput: {
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: 24,
    padding: 0,
  },
  resendText: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: Spacing.xxxl,
  },
});
