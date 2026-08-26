import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from './Icon';
import { StatusBadge } from './ui';
import { Text } from './ui';
import { SERVICE_META } from '@/constants/services';
import { formatNaira, formatDateTime } from '@/lib/format';
import type { Transaction } from '@/lib/api';
import { IconSize, Radii, Spacing } from '@/theme/tokens';

export interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const meta = transaction.service === 'WALLET' ? { icon: 'wallet' as const, color: '#00F4FE' } : SERVICE_META[transaction.service];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.serviceName} ${formatNaira(transaction.total)}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: withAlpha(meta.color, 0.15) }]}>
        <Icon name={meta.icon} size={IconSize.md} color={meta.color} />
      </View>
      <View style={styles.main}>
        <Text variant="bodyBold" numberOfLines={1}>
          {transaction.serviceName}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {formatDateTime(transaction.createdAt)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text variant="bodyBold">{formatNaira(transaction.total)}</Text>
        <StatusBadge status={transaction.status === 'successful' ? 'success' : transaction.status === 'failed' ? 'failed' : 'pending'} />
      </View>
    </Pressable>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  iconWrap: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: Spacing.xxs,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});