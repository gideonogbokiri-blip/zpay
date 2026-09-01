import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Button, InlineError, PinInput, Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { authenticateWithBiometrics, isBiometricsAvailable } from '@/lib/security/biometrics';
import { isValidPin } from '@/lib/validation/auth';
import { useSecurityPreferences } from '@/state/security';
import { useTransactionPinStore } from '@/state/transaction-pin';
import { Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { Icon } from '@/components/Icon';

export default function PinSetupScreen() {
  const { token, setUser } = useAuth();
  const colors = useTheme();
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const setDevicePin = useTransactionPinStore((state) => state.setPin);
  const [stage, setStage] = useState<'create' | 'confirm' | 'biometric'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useState(() => {
    isBiometricsAvailable().then(setBiometricsAvailable);
  });

  const handleChange = (value: string) => {
    setError(null);
    if (stage === 'create') {
      setPin(value);
      if (isValidPin(value)) {
        setConfirmPin('');
        setStage('confirm');
      }
    } else {
      setConfirmPin(value);
    }
  };

  const complete = async (skipPin = false) => {
    if (!token) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    if (!skipPin && pin !== confirmPin) {
      setError('PINs do not match. Try again.');
      setPin('');
      setConfirmPin('');
      setStage('create');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (!skipPin) {
        const { user } = await authApi.createPin(token, { pin });
        await setDevicePin(user.id, pin);
        recordSecurityEvent({
          type: 'pin_created',
          title: 'Transaction PIN created',
          detail: 'Device payment approval enabled',
        });
        setUser(user);
      } else {
        recordSecurityEvent({
          type: 'biometrics_enabled',
          title: 'Biometric login enabled',
          detail: 'User chose biometrics over PIN',
        });
      }
      router.replace('/(tabs)');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBiometric = async () => {
    const result = await authenticateWithBiometrics('Set up biometric login');
    if (result === 'success') {
      await complete(true);
    } else if (result === 'unavailable') {
      setError('Biometrics not available on this device.');
    } else if (result === 'failed') {
      setError('Biometric verification failed. Try again.');
    }
  };

  const completeEnabled = isValidPin(pin) && isValidPin(confirmPin);

  return (
    <Screen
      title={stage === 'create' ? 'Create your PIN' : stage === 'confirm' ? 'Confirm your PIN' : 'Biometric setup'}
      subtitle="Your 4-digit PIN protects payments and sensitive actions"
      back>
      <View style={styles.form}>
        <InlineError message={error} />

        {stage !== 'biometric' ? (
          <PinInput
            length={4}
            value={stage === 'create' ? pin : confirmPin}
            onChange={handleChange}
            label={stage === 'create' ? 'New PIN' : 'Confirm PIN'}
            autoFocus
          />
        ) : (
          <View style={styles.biometricContainer}>
            <View style={[styles.biometricIcon, { backgroundColor: 'rgba(0,229,255,0.12)' }]}>
              <Icon name="finger-print" size={48} color={colors.accent} />
            </View>
            <Text variant="body" color="textSecondary" style={styles.biometricText}>
              Use your fingerprint or face to log in and approve payments
            </Text>
          </View>
        )}

        {stage !== 'biometric' ? (
          <Button
            label="Set PIN"
            loading={submitting}
            disabled={submitting || !completeEnabled}
            onPress={() => complete(false)}
          />
        ) : (
          <Button
            label="Enable biometrics"
            loading={submitting}
            disabled={submitting}
            onPress={handleBiometric}
          />
        )}

        {biometricsAvailable && stage !== 'biometric' && (
          <Pressable
            style={styles.biometricLink}
            onPress={() => {
              setError(null);
              setStage('biometric');
            }}>
            <Icon name="finger-print" size={18} color={colors.accent} />
            <Text variant="small" color="accent" style={{ marginLeft: 6 }}>
              Use biometrics instead
            </Text>
          </Pressable>
        )}

        {stage === 'biometric' && (
          <Button
            label="Set PIN instead"
            variant="ghost"
            onPress={() => {
              setError(null);
              setStage('create');
            }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  biometricContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.lg,
  },
  biometricIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricText: {
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  biometricLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
});
