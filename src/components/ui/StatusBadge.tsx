import { StyleSheet } from 'react-native';

import { Text } from './Text';
import { View } from './View';

export type StatusKind = 'success' | 'pending' | 'failed' | 'info';

export interface StatusBadgeProps {
  status: StatusKind;
  label?: string;
}

const labelFor: Record<StatusKind, string> = {
  success: 'SUCCESS',
  pending: 'PENDING',
  failed: 'FAILED',
  info: 'INFO',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, statusStyles[status].bg]}>
      <Text variant="caption" style={[styles.text, statusStyles[status].fg]}>
        {label ?? labelFor[status]}
      </Text>
    </View>
  );
}

const statusStyles = {
  success: {
    bg: { backgroundColor: 'rgba(0, 200, 83, 0.15)' },
    fg: { color: '#00c853' },
  },
  pending: {
    bg: { backgroundColor: 'rgba(255, 176, 32, 0.15)' },
    fg: { color: '#FFB020' },
  },
  failed: {
    bg: { backgroundColor: 'rgba(255, 77, 106, 0.15)' },
    fg: { color: '#ff4d6a' },
  },
  info: {
    bg: { backgroundColor: 'rgba(77, 171, 247, 0.15)' },
    fg: { color: '#4DABF7' },
  },
} as const;

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});