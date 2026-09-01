import { Alert } from 'react-native';
import { useState } from 'react';

import { Button, PinInput, Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { isValidPin } from '@/lib/validation/auth';
import { useSecurityPreferences } from '@/state/security';
import { useTransactionPinStore, transactionPinErrorMessage } from '@/state/transaction-pin';
import { Spacing } from '@/theme/tokens';

export default function PinScreen() {
  const { user } = useAuth();
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const changePin = useTransactionPinStore((state) => state.changePin);
  const setDevicePin = useTransactionPinStore((state) => state.setPin);
  const hasDevicePin = useTransactionPinStore((state) => state.hasPin(user?.id));
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!user?.id) {
      setError('Your session has expired. Please log in again.');
      return;
    }
    if (hasDevicePin && !isValidPin(current)) {
      setError('Enter your current 4-digit PIN.');
      return;
    }
    if (!isValidPin(next)) {
      setError('Enter a new 4-digit PIN.');
      return;
    }
    if (next !== confirm) {
      setError('New PIN and confirmation do not match.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (hasDevicePin) {
        const result = await changePin(user.id, current, next);
        if (result !== 'verified') {
          setError(transactionPinErrorMessage(result));
          return;
        }
      } else {
        await setDevicePin(user.id, next);
      }

      Alert.alert('PIN updated', 'Your transaction PIN has been changed successfully.');
      recordSecurityEvent({
        type: hasDevicePin ? 'pin_updated' : 'pin_created',
        title: hasDevicePin ? 'Transaction PIN updated' : 'Transaction PIN created',
        detail: 'Device payment approval changed',
      });
      setCurrent('');
      setNext('');
      setConfirm('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen title="Transaction PIN" subtitle="Change your transaction PIN" back scroll>
      <Text variant="caption" color="textSecondary" style={{ marginBottom: Spacing.md }}>
        Your PIN is required to approve every payment.
      </Text>
      {hasDevicePin ? (
        <PinInput length={4} value={current} onChange={setCurrent} label="Current PIN" />
      ) : (
        <Text variant="small" color="textSecondary">
          Set a fresh PIN for this device to approve payments.
        </Text>
      )}
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
        loading={submitting}
        disabled={submitting || (hasDevicePin && current.length !== 4) || next.length !== 4 || confirm.length !== 4}
        style={{ marginTop: Spacing.lg }}
      />
    </Screen>
  );
}
