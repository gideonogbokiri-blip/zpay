import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TransactionDetails } from '@/components/TransactionDetails';
import { Button, Screen, Text } from '@/components/ui';
import { useTransaction } from '@/hooks/queries';
import { Spacing } from '@/theme/tokens';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: transaction, isLoading, error } = useTransaction(id);

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
            </View>
          ) : null}
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
  },
});