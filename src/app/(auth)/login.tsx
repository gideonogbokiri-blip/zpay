import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Button, InlineError, Input, Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { loginSchema, type LoginFormValues } from '@/lib/validation/auth';
import { Spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const session = await authApi.login(values);
      signIn(session);
      router.replace(session.user.pinSet ? '/' : '/pin-setup');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen title="Welcome back" subtitle="Log in to continue to your wallet" back>
      <View style={styles.form}>
        <InlineError message={error} />
        <Controller
          control={control}
          name="identifier"
          render={({ field }) => (
            <Input
              label="Phone number or email"
              placeholder="0801 234 5678"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.identifier?.message}
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
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
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
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});