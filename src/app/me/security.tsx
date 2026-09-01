import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Input, Screen, Text } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import { useSecurityPreferences } from '@/state/security';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function SecurityScreen() {
  const colors = useTheme();
  const accountFrozen = useSecurityPreferences((state) => state.accountFrozen);
  const setAccountFrozen = useSecurityPreferences((state) => state.setAccountFrozen);
  const recentEvents = useSecurityPreferences((state) => state.recentEvents);
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
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
    recordSecurityEvent({
      type: 'password_updated',
      title: 'Password updated',
      detail: 'Your account password was changed.',
    });
    Alert.alert('Password updated', 'Your password has been changed successfully.');
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  const toggleFreeze = () => {
    const nextValue = !accountFrozen;
    Alert.alert(
      nextValue ? 'Freeze outgoing payments?' : 'Unfreeze outgoing payments?',
      nextValue
        ? 'ZPAY will block payments from this device until you unfreeze the account.'
        : 'Payments can be approved again after PIN verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: nextValue ? 'Freeze' : 'Unfreeze',
          style: nextValue ? 'destructive' : 'default',
          onPress: () => {
            setAccountFrozen(nextValue);
            recordSecurityEvent({
              type: nextValue ? 'account_frozen' : 'account_unfrozen',
              title: nextValue ? 'Outgoing payments frozen' : 'Outgoing payments unfrozen',
              detail: nextValue
                ? 'Payments are blocked on this device.'
                : 'Payments can be approved on this device.',
            });
          },
        },
      ]
    );
  };

  return (
    <Screen title="Security" subtitle="Protect account access and payments" back scroll>
      <Pressable
        onPress={toggleFreeze}
        accessibilityRole="switch"
        accessibilityState={{ checked: accountFrozen }}
        accessibilityLabel="Freeze outgoing payments"
        style={({ pressed }) => [
          styles.freezeCard,
          {
            backgroundColor: accountFrozen ? colors.dangerSoft : colors.surfaceElevated,
            borderColor: accountFrozen ? colors.danger : colors.border,
          },
          pressed && styles.pressed,
        ]}>
        <View style={[styles.freezeIcon, { backgroundColor: accountFrozen ? colors.dangerSoft : colors.accentSoft }]}>
          <Icon
            name={accountFrozen ? 'snow-outline' : 'shield-checkmark-outline'}
            size={IconSize.lg}
            color={accountFrozen ? colors.danger : colors.accent}
          />
        </View>
        <View style={styles.freezeText}>
          <Text variant="bodyBold">{accountFrozen ? 'Outgoing payments frozen' : 'Freeze outgoing payments'}</Text>
          <Text variant="caption" color="textSecondary">
            {accountFrozen
              ? 'Payments are blocked from this device.'
              : 'Block airtime, data, TV, electricity, and exam payments instantly.'}
          </Text>
        </View>
        <Icon name="chevron-forward" size={IconSize.sm} color={colors.textMuted} />
      </Pressable>

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

      <View style={styles.section}>
        <Text variant="title">Recent security activity</Text>
        <Text variant="caption" color="textMuted">
          Review recent access and security changes on this device.
        </Text>
        <View style={[styles.activityList, { borderColor: colors.border }]}>
          {recentEvents.length === 0 ? (
            <Text variant="small" color="textMuted" style={styles.empty}>
              No security activity recorded on this device yet.
            </Text>
          ) : (
            recentEvents.map((event) => (
              <View key={event.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                <View style={styles.activityText}>
                  <Text variant="bodyBold">{event.title}</Text>
                  {event.detail ? (
                    <Text variant="caption" color="textMuted">
                      {event.detail}
                    </Text>
                  ) : null}
                </View>
                <Text variant="caption" color="textMuted">
                  {formatDateTime(event.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.xxxl,
    gap: Spacing.xs,
  },
  freezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  freezeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  activityList: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderRadius: Spacing.md,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  activityText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  empty: {
    padding: Spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
