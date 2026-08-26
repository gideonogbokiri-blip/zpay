import { StyleSheet, View } from 'react-native';

import { Text } from '../ui';
import { Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface PaymentSummaryRow {
  label: string;
  value: string;
  strong?: boolean;
}

export interface PaymentSummaryProps {
  rows: PaymentSummaryRow[];
}

export function PaymentSummary({ rows }: PaymentSummaryProps) {
  const colors = useTheme();
  return (
    <View style={styles.container}>
      {rows.map((row, index) => (
        <View
          key={`${row.label}-${index}`}
          style={[
            styles.row,
            index === rows.length - 1 && { borderBottomWidth: 0 },
            { borderBottomColor: colors.border },
          ]}>
          <Text variant={row.strong ? 'bodyBold' : 'body'} color={row.strong ? 'text' : 'textSecondary'}>
            {row.label}
          </Text>
          <Text variant={row.strong ? 'bodyBold' : 'body'} style={{ color: row.strong ? colors.accent : colors.text }}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
});