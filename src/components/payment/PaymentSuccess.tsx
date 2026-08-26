import { StyleSheet, View } from 'react-native';

import { Icon } from '../Icon';
import { Button, Text } from '../ui';
import { formatNaira, formatDateTime } from '@/lib/format';
import type { Transaction } from '@/lib/api';
import { IconSize, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface PaymentSuccessProps {
  transaction: Transaction;
  registrationStatus?: string;
  onViewReceipt?: () => void;
  onDone?: () => void;
}

export function PaymentSuccess({
  transaction,
  registrationStatus,
  onViewReceipt,
  onDone,
}: PaymentSuccessProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
        <Icon name="checkmark" size={IconSize.xxl} color={colors.success} />
      </View>
      <Text variant="heading" style={styles.title}>
        Payment Successful
      </Text>
      <Text variant="body" color="textSecondary" style={styles.message}>
        Your {transaction.serviceName} payment was completed successfully.
      </Text>

      {registrationStatus ? (
        <View style={[styles.registration, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text variant="label" color="textSecondary">
            Registration status
          </Text>
          <Text variant="bodyBold" color="success">
            {registrationStatus}
          </Text>
        </View>
      ) : null}

      <View style={styles.details}>
        <DetailRow label="Amount paid" value={formatNaira(transaction.total)} />
        <DetailRow label="Service" value={transaction.serviceName} />
        {transaction.customerIdentifier ? (
          <DetailRow label="Customer" value={transaction.customerIdentifier} />
        ) : null}
        <DetailRow label="Reference" value={transaction.reference} />
        <DetailRow label="Date & time" value={formatDateTime(transaction.createdAt)} />
      </View>

      <View style={styles.actions}>
        {onViewReceipt ? (
          <Button label="View Receipt" onPress={onViewReceipt} />
        ) : null}
        {onDone ? <Button label="Done" variant="secondary" onPress={onDone} /> : null}
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={styles.detailRow}>
      <Text variant="small" color="textSecondary">
        {label}
      </Text>
      <Text variant="smallBold" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    gap: Spacing.sm,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  registration: {
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
    borderRadius: Spacing.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  details: {
    alignSelf: 'stretch',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    marginTop: Spacing.xxxl,
  },
});