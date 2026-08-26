import { StyleSheet, View } from 'react-native';

import { Icon } from '../Icon';
import { Button, Text } from '../ui';
import { formatNaira } from '@/lib/format';
import { IconSize, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface InsufficientBalanceProps {
  balance: number;
  required: number;
  needed: number;
  onFundWallet?: () => void;
  onCancel?: () => void;
}

export function InsufficientBalance({
  balance,
  required,
  needed,
  onFundWallet,
  onCancel,
}: InsufficientBalanceProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
        <Icon name="wallet-outline" size={IconSize.xxl} color={colors.danger} />
      </View>
      <Text variant="heading" style={styles.title}>
        Insufficient Balance
      </Text>
      <Text variant="body" color="textSecondary" style={styles.message}>
        Your wallet balance is not enough to complete this payment.
      </Text>

      <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <SummaryRow label="Current balance" value={formatNaira(balance)} />
        <SummaryRow label="Required amount" value={formatNaira(required)} />
        <SummaryRow label="Amount needed" value={formatNaira(needed)} strong />
      </View>

      <View style={styles.actions}>
        {onFundWallet ? (
          <Button label="Fund Wallet" onPress={onFundWallet} />
        ) : null}
        {onCancel ? <Button label="Cancel" variant="ghost" onPress={onCancel} /> : null}
      </View>
    </View>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const colors = useTheme();
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'bodyBold' : 'small'} color="textSecondary">
        {label}
      </Text>
      <Text variant={strong ? 'bodyBold' : 'smallBold'} style={{ color: strong ? colors.accent : colors.text }}>
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
  summary: {
    alignSelf: 'stretch',
    marginTop: Spacing.xl,
    borderRadius: Spacing.lg,
    borderWidth: 1,
    padding: Spacing.lg,
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
    marginTop: Spacing.xxxl,
  },
});