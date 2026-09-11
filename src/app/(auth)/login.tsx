import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, StyleSheet } from 'react-native';

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
    <Screen title={undefined} scroll contentStyle={styles.content}>
      {/* Hero with brand + woman image side by side */}
      <View style={styles.hero}>
        <View style={styles.heroLeft}>
          <ZpayMark size={48} />
          <Text style={styles.logoText}>ZPAY</Text>
          <Text variant="small" color="textSecondary" style={styles.tagline}>
            Pay bills, airtime &amp; exam fees — all in one place.
          </Text>
        </View>
        <Image
          source={require('../../../assets/images/woman-hero.jpg')}
          style={styles.heroImage}
          resizeMode="contain"
          accessibilityLabel="Professional woman using ZPAY"
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

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
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 0,
    backgroundColor: '#0d1a24',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroLeft: {
    flex: 1,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#ffffff',
  },
  tagline: {
    lineHeight: 20,
    fontSize: 12,
  },
  heroImage: {
    width: 140,
    height: 180,
    marginBottom: -2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    marginHorizontal: Spacing.xxl,
    marginVertical: Spacing.xxl,
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
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
});
