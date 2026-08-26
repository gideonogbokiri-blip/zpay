import { StyleSheet, View } from 'react-native';

import { PaymentSummary } from './payment/PaymentSummary';
import { StatusBadge, Text } from './ui';
import { formatNaira, formatDateTime } from '@/lib/format';
import type { Transaction } from '@/lib/api';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="caption" color="textSecondary">
          Total paid
        </Text>
        <Text variant="amount" color="accent">
          {formatNaira(transaction.total)}
        </Text>
        <StatusBadge
          status={transaction.status === 'successful' ? 'success' : transaction.status === 'failed' ? 'failed' : 'pending'}
        />
      </View>

      <PaymentSummary
        rows={[
          { label: 'Service', value: transaction.serviceName },
          { label: 'Amount', value: formatNaira(transaction.amount) },
          { label: 'Fee', value: formatNaira(transaction.fee) },
          { label: 'Total', value: formatNaira(transaction.total), strong: true },
          { label: 'Status', value: transaction.status },
          { label: 'Payment method', value: 'ZPAY Wallet' },
          { label: 'Date & time', value: formatDateTime(transaction.createdAt) },
          { label: 'Reference', value: transaction.reference, strong: true },
          ...(transaction.customerIdentifier
            ? [{ label: 'Customer / service ID', value: transaction.customerIdentifier }]
            : []),
          ...(transaction.providerReference
            ? [{ label: 'Provider reference', value: transaction.providerReference }]
            : []),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  header: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
});