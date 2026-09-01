import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Share, StyleSheet, View } from 'react-native';

import { TransactionDetails } from '@/components/TransactionDetails';
import { Button, Screen, Text } from '@/components/ui';
import { useTransaction } from '@/hooks/queries';
import { copyToClipboard } from '@/lib/clipboard';
import { buildReceiptText } from '@/lib/receipt';
import { useSupportStore } from '@/state/support';
import { Spacing } from '@/theme/tokens';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: transaction, isLoading, error } = useTransaction(id);
  const createTransactionTicket = useSupportStore((state) => state.createTransactionTicket);

  const shareReceipt = async () => {
    if (!transaction) return;
    await Share.share({ message: buildReceiptText(transaction) });
  };

  const reportTransaction = async () => {
    if (!transaction) return;
    const ticket = createTransactionTicket(transaction);
    Alert.alert('Support ticket created', `Ticket ${ticket.reference} is linked to ${transaction.reference}.`, [
      { text: 'View support', onPress: () => router.push('/support') },
      { text: 'OK' },
    ]);
  };

  const copyReference = async () => {
    if (!transaction) return;
    await copyToClipboard(transaction.reference);
    Alert.alert('Reference copied', transaction.reference);
  };

  return (
    <Screen title="Transaction details" back>
      {isLoading ? (
        <Text variant="small" color="textMuted">
          Loading transaction...
        </Text>
      ) : error || !transaction ? (
        <View style={styles.state}>
          <Text variant="body" color="textSecondary">
            We could not find this transaction.
          </Text>
          <Button label="Go to History" variant="secondary" onPress={() => router.replace('/history')} />
        </View>
      ) : (
        <View style={styles.content}>
          <TransactionDetails transaction={transaction} />
          {transaction.status === 'successful' ? (
            <View style={styles.actions}>
              <Button
                label="View Receipt"
                onPress={() => router.push(`/tx/${transaction.id}/receipt`)}
              />
              <Button label="Copy reference" variant="outline" onPress={copyReference} />
              <Button label="Share receipt" variant="secondary" onPress={shareReceipt} />
              <Button label="Report this transaction" variant="ghost" onPress={reportTransaction} />
            </View>
          ) : (
            <View style={styles.actions}>
              <Button label="Copy reference" variant="outline" onPress={copyReference} />
              <Button label="Report this transaction" variant="secondary" onPress={reportTransaction} />
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.xxl,
  },
  state: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.xxxl,
  },
  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
});
