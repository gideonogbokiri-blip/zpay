import { Alert } from 'react-native';
import { useState } from 'react';

import { Button, Input, Screen } from '@/components/ui';

export default function SecurityScreen() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.');
      return;
    }
    setError(null);
    Alert.alert('Password updated', 'Your password has been changed successfully.');
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  return (
    <Screen title="Security" subtitle="Change your password" back scroll>
      <Input
        label="Current password"
        value={current}
        onChangeText={setCurrent}
        secureTextEntry
        placeholder="Enter current password"
      />
      <Input
        label="New password"
        value={next}
        onChangeText={setNext}
        secureTextEntry
        placeholder="At least 8 characters"
      />
      <Input
        label="Confirm new password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="Repeat new password"
        error={error}
      />
      <Button label="Update password" onPress={submit} disabled={!current || !next || !confirm} />
    </Screen>
  );
}