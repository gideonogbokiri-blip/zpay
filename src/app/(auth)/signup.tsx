import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, InlineError, Input, Screen, Text, View } from '@/components/ui';
import { authApi, normalizeError } from '@/lib/api';
import { useSecurityPreferences } from '@/state/security';
import { Spacing } from '@/theme/tokens';
import { z } from 'zod';

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z.string().trim().regex(/^(\+?234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', phone: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const { verificationId } = await authApi.signup({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });
      router.push({ pathname: '/otp', params: { verificationId } });
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
          Create your account in seconds
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="title" style={styles.formTitle}>
          Sign up
        </Text>
        <Text variant="small" color="textSecondary" style={styles.formSubtitle}>
          Enter your details to get started
        </Text>
        <InlineError message={error} />
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <Input
              label="Full name"
              placeholder="Ada Obi"
              autoCapitalize="words"
              textContentType="name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
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
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              label="Email address"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              textContentType="newPassword"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              label="Confirm password"
              placeholder="Repeat your password"
              secureTextEntry
              textContentType="newPassword"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Button
          label="Create account"
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <View style={styles.footer}>
        <Text variant="small" color="textSecondary">
          Already have an account?{' '}
          <Link href="/login">
            <Text variant="smallBold" color="accent">
              Log in
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
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: Spacing.xxxl,
  },
});
