import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { ThemeProvider, useTheme } from '@/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function RootNavigator() {
  const colors = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="wallet/fund" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="services/[service]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="tx/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="tx/[id]/receipt" options={{ presentation: 'modal' }} />
      <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="me/profile" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="me/kyc" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="me/security" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="me/pin" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="me/settings" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider variant="dark">
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </QueryClientProvider>
  );
}