import { StyleSheet, View } from 'react-native';

import { Text } from '../ui';
import { formatNaira } from '@/lib/format';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface WalletBalanceSummaryProps {
  currentBalance: number;
  remainingBalance: number;
  total: number;
}

export function WalletBalanceSummary({ currentBalance, remainingBalance, total }: WalletBalanceSummaryProps) {
  const colors = useTheme();
  const sufficient = remainingBalance >= 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text variant="small" color="textSecondary">
          Current wallet balance
        </Text>
        <Text variant="bodyBold">{formatNaira(currentBalance)}</Text>
      </View>
      <View style={styles.row}>
        <Text variant="small" color="textSecondary">
          Total to pay
        </Text>
        <Text variant="bodyBold" color="accent">
          {formatNaira(total)}
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.row}>
        <Text variant="small" color="textSecondary">
          Remaining balance
        </Text>
        <Text variant="bodyBold" style={{ color: sufficient ? colors.success : colors.danger }}>
          {formatNaira(Math.max(remainingBalance, 0))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
});