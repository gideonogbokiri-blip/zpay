import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';

import { ApiError, authApi } from '@/lib/api';
import { __getMockOtpCode, __resetMockAuth } from '@/lib/api/mock/auth.mock';
import { useSessionStore } from '@/state/session';
import { useAuth } from '@/hooks/use-auth';

beforeEach(async () => {
  __resetMockAuth();
  useSessionStore.setState({ hydrated: false, token: null, user: null });
  await AsyncStorage.clear();
});

const signupPayload = {
  fullName: 'Ada Obi',
  phone: '08012345678',
  email: 'ada@example.com',
  password: 'secret1',
};

describe('mock auth api', () => {
  it('signup -> verify otp -> login flow works', async () => {
    const { verificationId } = await authApi.signup(signupPayload);
    const code = __getMockOtpCode(verificationId);
    expect(code).toMatch(/^\d{6}$/);

    const session = await authApi.verifyOtp({ verificationId, code: code! });
    expect(session.token).toBeTruthy();
    expect(session.user.pinSet).toBe(false);

    const login = await authApi.login({ identifier: '08012345678', password: 'secret1' });
    expect(login.user.fullName).toBe('Ada Obi');

    const updated = await authApi.createPin(session.token, { pin: '1234' });
    expect(updated.user.pinSet).toBe(true);
  });

  it('rejects wrong OTP code', async () => {
    const { verificationId } = await authApi.signup(signupPayload);
    await expect(authApi.verifyOtp({ verificationId, code: '000000' })).rejects.toBeInstanceOf(
      ApiError
    );
  });

  it('rejects wrong password', async () => {
    await authApi.signup(signupPayload);
    await expect(
      authApi.login({ identifier: 'ada@example.com', password: 'wrong' })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('rejects duplicate signup', async () => {
    await authApi.signup(signupPayload);
    await expect(authApi.signup(signupPayload)).rejects.toBeInstanceOf(ApiError);
  });
});

describe('useAuth', () => {
  it('is signedOut when there is no session', async () => {
    useSessionStore.setState({ hydrated: true, token: null, user: null });
    const { result } = await renderHook(() => useAuth());
    expect(result.current.status).toBe('signedOut');
  });

  it('becomes signedIn after signIn and signedOut after signOut', async () => {
    useSessionStore.setState({ hydrated: true, token: null, user: null });
    const { result } = await renderHook(() => useAuth());

    await act(async () => {
      result.current.signIn({
        token: 't1',
        user: { ...signupPayload, id: 'u1', pinSet: true, verificationTier: 'unverified' },
      });
    });
    expect(result.current.status).toBe('signedIn');

    await act(async () => {
      result.current.signOut();
    });
    expect(result.current.status).toBe('signedOut');
  });
});