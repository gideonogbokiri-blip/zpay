import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricEnableResult =
  | 'enabled'
  | 'unavailable'
  | 'cancelled';

interface EnableBiometricsOptions {
  setEnabled: (value: boolean) => void;
  onUnavailable?: () => void;
  onEnabled?: () => void;
}

export async function enableBiometricAuthentication({
  setEnabled,
  onUnavailable,
  onEnabled,
}: EnableBiometricsOptions): Promise<BiometricEnableResult> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    onUnavailable?.();
    return 'unavailable';
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Enable biometric authentication',
    fallbackLabel: 'Use device passcode',
    disableDeviceFallback: false,
  });

  if (!result.success) {
    return 'cancelled';
  }

  setEnabled(true);
  onEnabled?.();
  return 'enabled';
}
