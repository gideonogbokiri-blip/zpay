import { Alert } from 'react-native';
import { useState } from 'react';

import { Button, PinInput, Screen, Text } from '@/components/ui';
import { Spacing } from '@/theme/tokens';

export default function PinScreen() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (current.length !== 4) {
      setError('Enter your current 4-digit PIN.');
      return;
    }
    if (next.length !== 4) {
      setError('Enter a new 4-digit PIN.');
      return;
    }
    if (next !== confirm) {
      setError('New PIN and confirmation do not match.');
      return;
    }
    setError(null);
    Alert.alert('PIN updated', 'Your transaction PIN has been changed successfully.');
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  return (
    <Screen title="Transaction PIN" subtitle="Change your transaction PIN" back scroll>
      <Text variant="caption" color="textSecondary" style={{ marginBottom: Spacing.md }}>
        Your PIN is required to approve every payment.
      </Text>
      <PinInput length={4} value={current} onChange={setCurrent} label="Current PIN" />
      <PinInput length={4} value={next} onChange={setNext} label="New PIN" />
      <PinInput
        length={4}
        value={confirm}
        onChange={setConfirm}
        label="Confirm new PIN"
        error={error}
        autoFocus={false}
      />
      <Button
        label="Update PIN"
        onPress={submit}
        disabled={current.length !== 4 || next.length !== 4 || confirm.length !== 4}
        style={{ marginTop: Spacing.lg }}
      />
    </Screen>
  );
}