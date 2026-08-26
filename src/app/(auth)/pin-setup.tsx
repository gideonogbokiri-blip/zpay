import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, InlineError, PinInput, Screen, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authApi, normalizeError } from '@/lib/api';
import { isValidPin } from '@/lib/validation/auth';
import { Spacing } from '@/theme/tokens';

export default function PinSetupScreen() {
  const { token, setUser } = useAuth();
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const complete = async () => {
    if (!token) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match. Try again.');
      setPin('');
      setConfirmPin('');
      setStage('create');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { user } = await authApi.createPin(token, { pin });
      setUser(user);
      router.replace('/');
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setSubmitting(false);
    }
  };

  const completeEnabled = isValidPin(pin) && isValidPin(confirmPin);

  return (
    <Screen
      title={stage === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
      subtitle="Your 4-digit PIN protects payments and sensitive actions"
      back>
      <View style={styles.form}>
        <InlineError message={error} />
        <PinInput
          length={4}
          value={stage === 'create' ? pin : confirmPin}
          onChange={handleChange}
          label={stage === 'create' ? 'New PIN' : 'Confirm PIN'}
          autoFocus
        />
        <Button
          label="Set PIN"
          loading={submitting}
          disabled={submitting || !completeEnabled}
          onPress={complete}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
});