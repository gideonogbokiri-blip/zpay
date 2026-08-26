import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function SettingsScreen() {
  const colors = useTheme();
  const [biometrics, setBiometrics] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <Screen title="Settings" subtitle="App preferences" back scroll>
      <SettingToggle
        label="Biometric authentication"
        description="Use Face ID / fingerprint to approve payments"
        value={biometrics}
        onChange={setBiometrics}
      />
      <SettingToggle
        label="Push notifications"
        description="Get alerts for payments, funding and registrations"
        value={notifications}
        onChange={setNotifications}
      />
      <View style={[styles.about, { backgroundColor: colors.surfaceElevated }]}>
        <Text variant="small" color="textSecondary">
          ZPAY version 1.0.0
        </Text>
      </View>
    </Screen>
  );
}

interface SettingToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function SettingToggle({ label, description, value, onChange }: SettingToggleProps) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.text}>
        <Text variant="body">{label}</Text>
        <Text variant="caption" color="textMuted">
          {description}
        </Text>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? colors.accent : colors.surfaceElevated },
        ]}>
        <View
          style={[
            styles.thumb,
            { backgroundColor: value ? colors.background : colors.textMuted, alignSelf: value ? 'flex-end' : 'flex-start' },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.lg,
  },
  text: {
    flex: 1,
    gap: Spacing.xxs,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  about: {
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: Spacing.md,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});