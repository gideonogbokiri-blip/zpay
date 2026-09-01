import * as LocalAuthentication from 'expo-local-authentication';

import { enableBiometricAuthentication } from '@/lib/security/biometrics';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('enableBiometricAuthentication', () => {
  it('enables biometrics after device authentication succeeds', async () => {
    const setEnabled = jest.fn();
    const onEnabled = jest.fn();

    await expect(enableBiometricAuthentication({ setEnabled, onEnabled })).resolves.toBe('enabled');

    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith({
      promptMessage: 'Enable biometric authentication',
      fallbackLabel: 'Use device passcode',
      disableDeviceFallback: false,
    });
    expect(setEnabled).toHaveBeenCalledWith(true);
    expect(onEnabled).toHaveBeenCalledTimes(1);
  });

  it('does not enable biometrics when no biometric is enrolled', async () => {
    jest.spyOn(LocalAuthentication, 'isEnrolledAsync').mockResolvedValueOnce(false);
    const setEnabled = jest.fn();
    const onUnavailable = jest.fn();

    await expect(enableBiometricAuthentication({ setEnabled, onUnavailable })).resolves.toBe(
      'unavailable'
    );

    expect(LocalAuthentication.authenticateAsync).not.toHaveBeenCalled();
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    expect(setEnabled).not.toHaveBeenCalled();
  });
});
