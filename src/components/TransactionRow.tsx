import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from './Icon';
import { Text } from './ui';
import { SERVICE_META } from '@/constants/services';
import { formatNaira, formatDateTime } from '@/lib/format';
import type { Transaction } from '@/lib/api';

export interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const meta = transaction.service === 'WALLET'
    ? { icon: 'wallet' as const, color: '#00e5ff', bgColor: 'rgba(0, 229, 255, 0.15)' }
    : { ...SERVICE_META[transaction.service], bgColor: withAlpha(SERVICE_META[transaction.service].color, 0.15) };

  const isFailed = transaction.status === 'failed';
  const isSuccess = transaction.status === 'successful';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.serviceName} ${formatNaira(transaction.total)}`}
      style={({ pressed }) => [styles.txItem, pressed && styles.pressed]}>
      <View style={[styles.txIcon, { backgroundColor: meta.bgColor }]}>
        <Icon name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.txDetails}>
        <Text variant="body" style={styles.txName}>
          {transaction.serviceName}
        </Text>
        <Text variant="caption" style={styles.txTime}>
          {formatDateTime(transaction.createdAt)}
        </Text>
      </View>
      <View style={styles.txRight}>
        <Text variant="bodyBold" style={styles.txAmount}>
          -{formatNaira(transaction.total)}
        </Text>
        <View style={[styles.txStatus, isFailed && styles.statusFailed, isSuccess && styles.statusSuccess]}>
          <Text variant="caption" style={[styles.txStatusText, isFailed && styles.statusFailedText, isSuccess && styles.statusSuccessText]}>
            {isFailed ? 'FAILED' : isSuccess ? 'SUCCESS' : 'PENDING'}
          </Text>
        </View>
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
  txItem: {
    backgroundColor: '#121a23',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {
    flex: 1,
    minWidth: 0,
  },
  txName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    color: '#ffffff',
  },
  txTime: {
    fontSize: 12,
    color: '#8b9aab',
  },
  txRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#ffffff',
  },
  txStatus: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  txStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusFailed: {
    backgroundColor: 'rgba(255, 77, 106, 0.15)',
  },
  statusFailedText: {
    color: '#ff4d6a',
  },
  statusSuccess: {
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
  },
  statusSuccessText: {
    color: '#00c853',
  },
  pressed: {
    opacity: 0.7,
  },
});