import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from 'expo-router';

import LoginScreen from '@/app/(auth)/login';
import OtpScreen from '@/app/(auth)/otp';
import TabsLayout from '@/app/(tabs)/_layout';
import HomeScreen from '@/app/(tabs)/index';
import { authApi } from '@/lib/api';
import { __getMockOtpCode, __resetMockAuth } from '@/lib/api/mock/auth.mock';
import { useSessionStore } from '@/state/session';

jest.mock('expo-router', () => {
  const { Text, View } = require('react-native');
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
    Tabs: Object.assign(
      ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
      { Screen: () => null }
    ),
    router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
    useLocalSearchParams: jest.fn(),
  };
});

beforeEach(async () => {
  jest.clearAllMocks();
  __resetMockAuth();
  useSessionStore.setState({ hydrated: true, token: null, user: null });
});

const signupPayload = {
  fullName: 'Ada Obi',
  phone: '08012345678',
  email: 'ada@example.com',
  password: 'secret1',
};

describe('LoginScreen', () => {
  it('shows the phone input and continue button', async () => {
    const screen = await render(<LoginScreen />);
    expect(await screen.findByText('Get started')).toBeTruthy();
    expect(screen.getByPlaceholderText('0801 234 5678')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  }, 15000);

  it('requests OTP and navigates to verification for an existing account', async () => {
    await authApi.signup(signupPayload);

    const screen = await render(<LoginScreen />);
    await fireEvent.changeText(screen.getByPlaceholderText('0801 234 5678'), '08012345678');
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Verify your number')).toBeTruthy();
    });
  }, 15000);

  it('shows an error for unregistered phone number', async () => {
    const screen = await render(<LoginScreen />);
    await fireEvent.changeText(screen.getByPlaceholderText('0801 234 5678'), '08099999999');
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByText('No account found with this phone number. Please sign up first.')).toBeTruthy();
  }, 15000);
});

describe('OtpScreen', () => {
  it('verifies the code and signs the user in', async () => {
    const { verificationId } = await authApi.signup(signupPayload);
    const code = __getMockOtpCode(verificationId)!;

    const params = { verificationId };
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue(params);

    const screen = await render(<OtpScreen />);
    await fireEvent.changeText(
      screen.getByTestId('pin-input', { includeHiddenElements: true }),
      code
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Verify code' }));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/pin-setup'));
  });
});

describe('Tabs auth guard', () => {
  it('redirects signed-out users to welcome', async () => {
    const screen = await render(<TabsLayout />);
    expect(screen.getByTestId('redirect').props.children).toBe('/welcome');
  });

  it('renders content for signed-in users', async () => {
    useSessionStore.getState().signIn({
      token: 't1',
      user: { ...signupPayload, id: 'u1', pinSet: true, verificationTier: 'unverified' },
    });
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const screen = await render(
      <QueryClientProvider client={qc}>
        <HomeScreen />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Ada/)).toBeTruthy();
  }, 15000);
});
