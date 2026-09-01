import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, InlineError, Input, Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { useSecurityPreferences } from '@/state/security';
import { Spacing } from '@/theme/tokens';
import { z } from 'zod';

const loginSchema = z.object({
  phone: z.string().trim().min(3, 'Enter your phone number or email'),
  password: z.string().min(1, 'Enter your password'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const session = await authApi.login({ identifier: values.phone, password: values.password });
      signIn(session);
      recordSecurityEvent({
        type: 'login',
        title: 'Password login',
        detail: session.user.phone,
      });
      router.replace(session.user.pinSet ? '/(tabs)' : '/pin-setup');
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
          Pay bills, buy airtime and register for exams — all in one place.
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="title" style={styles.formTitle}>
          Welcome back
        </Text>
        <Text variant="small" color="textSecondary" style={styles.formSubtitle}>
          Log in to your account
        </Text>
        <InlineError message={error} />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              label="Phone number or email"
              placeholder="0801 234 5678"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="username"
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
              placeholder="Your password"
              secureTextEntry
              textContentType="password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Button
          label="Log in"
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

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
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: Spacing.xxxl,
  },
});
