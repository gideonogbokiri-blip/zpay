import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Button, InlineError, Input, Screen, Text, View } from '@/components/ui';
import { authApi, normalizeError } from '@/lib/api';
import { signupSchema, type SignupFormValues } from '@/lib/validation/auth';
import { Spacing } from '@/theme/tokens';

export default function SignupScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
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
    <Screen title="Create account" subtitle="Start paying bills in minutes" back>
      <View style={styles.form}>
        <InlineError message={error} />
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <Input
              label="Full name"
              placeholder="Ada Obi"
              autoCapitalize="words"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.fullName?.message}
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
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.phone?.message}
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
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
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
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
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
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.confirmPassword?.message}
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
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});