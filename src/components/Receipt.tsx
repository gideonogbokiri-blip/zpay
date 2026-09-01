import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';

import { Icon } from './Icon';
import { Button, Text } from './ui';
import { copyToClipboard } from '@/lib/clipboard';
import { buildReceiptText } from '@/lib/receipt';
import { formatNaira, formatDateTime } from '@/lib/format';
import type { Transaction } from '@/lib/api';
import { IconSize, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface ReceiptProps {
  transaction: Transaction;
  onClose?: () => void;
}

export function Receipt({ transaction, onClose }: ReceiptProps) {
  const colors = useTheme();

  const onShare = async () => {
    try {
      await Share.share({
        message: buildReceiptText(transaction),
      });
    } catch {
      // share dismissed
    }
  };

  const onDownload = () => {
    Alert.alert(
      'Receipt export',
      'PDF export needs a native file/PDF module. Use Share for now; the receipt text includes the transaction reference for support.'
    );
  };

  const onCopyReference = async () => {
    await copyToClipboard(transaction.reference);
    Alert.alert('Reference copied', transaction.reference);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="title">Receipt</Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close receipt" hitSlop={Spacing.md}>
          <Icon name="close" size={IconSize.lg} color={colors.text} />
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="heading" style={styles.brand}>
          ZPAY
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
          <Icon name="checkmark" size={IconSize.xl} color={colors.success} />
        </View>
        <Text variant="bodyBold" color="success">
          Transaction Successful
        </Text>
        <Text variant="amount" color="accent" style={styles.amount}>
          {formatNaira(transaction.total)}
        </Text>

        <View style={styles.rows}>
          <Row label="Paid on" value={formatDateTime(transaction.createdAt)} />
          <Row label="Service" value={transaction.serviceName} />
          <Row label="Reference" value={transaction.reference} />
          {transaction.customerIdentifier ? (
            <Row label="Customer / service ID" value={transaction.customerIdentifier} />
          ) : null}
          <Row label="Payment method" value="ZPAY Wallet" />
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Download" variant="secondary" onPress={onDownload} />
        <Button label="Copy reference" variant="outline" onPress={onCopyReference} />
        <Button label="Share receipt" onPress={onShare} />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={styles.row}>
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
    paddingTop: Spacing.lg,
    gap: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    borderRadius: Spacing.xxl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brand: {
    letterSpacing: 4,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  amount: {
    marginVertical: Spacing.sm,
  },
  rows: {
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    marginTop: 'auto',
    paddingBottom: Spacing.xxxl,
  },
});
