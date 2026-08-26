import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Receipt } from '@/components/Receipt';
import { Screen, Text } from '@/components/ui';
import { useTransaction } from '@/hooks/queries';

export default function ReceiptScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: transaction, isLoading, error } = useTransaction(id);

  return (
    <Screen title={undefined} back>
      {isLoading ? (
        <Text variant="small" color="textMuted">
          Loading receipt...
        </Text>
      ) : error || !transaction ? (
        <View style={styles.state}>
          <Text variant="body" color="textSecondary">
            We could not find this receipt.
          </Text>
        </View>
      ) : (
        <Receipt transaction={transaction} onClose={() => router.back()} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  state: {
    alignItems: 'center',
    paddingTop: 48,
  },
});