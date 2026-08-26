import { StyleSheet } from 'react-native';

import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { View } from './View';

export type StatusKind = 'success' | 'pending' | 'failed' | 'info';

export interface StatusBadgeProps {
  status: StatusKind;
  label?: string;
}

const labelFor: Record<StatusKind, string> = {
  success: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
  info: 'Info',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = useTheme();
  const bg = softBackground[status](colors);
  const fg = statusColor[status](colors);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="caption" style={{ color: fg, fontWeight: '600' }}>
        {label ?? labelFor[status]}
      </Text>
    </View>
  );
}

const statusColor = {
  success: (c: ReturnType<typeof useTheme>) => c.success,
  pending: (c: ReturnType<typeof useTheme>) => c.warning,
  failed: (c: ReturnType<typeof useTheme>) => c.danger,
  info: (c: ReturnType<typeof useTheme>) => c.info,
} as const;

const softBackground = {
  success: (c: ReturnType<typeof useTheme>) => c.successSoft,
  pending: (c: ReturnType<typeof useTheme>) => 'rgba(255, 176, 32, 0.14)',
  failed: (c: ReturnType<typeof useTheme>) => c.dangerSoft,
  info: (c: ReturnType<typeof useTheme>) => 'rgba(77, 171, 247, 0.14)',
} as const;

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm + Spacing.xs,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
});