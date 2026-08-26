import { Pressable, StyleSheet } from 'react-native';

import { Card, Text, View } from './ui';
import { formatNaira } from '@/lib/format';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface WalletCardProps {
  balance: number;
  loading?: boolean;
  onFundPress?: () => void;
  onPress?: () => void;
}

export function WalletCard({ balance, loading, onFundPress, onPress }: WalletCardProps) {
  const colors = useTheme();

  const content = (
    <Card elevated style={styles.card}>
      <View style={styles.topRow}>
        <Text variant="label" color="textSecondary">
          Wallet balance
        </Text>
        <Text variant="caption" color="textMuted">
          NGN
        </Text>
      </View>
      {loading ? (
        <Text variant="amount" color="textMuted">
          ------
        </Text>
      ) : (
        <Text variant="amount" color="accent">
          {formatNaira(balance)}
        </Text>
      )}
      <View style={styles.bottomRow}>
        <Pressable
          onPress={onFundPress}
          accessibilityRole="button"
          accessibilityLabel="Fund wallet"
          style={({ pressed }) => [
            styles.fundButton,
            { backgroundColor: colors.accent },
            pressed && styles.pressed,
          ]}>
          <Text variant="smallBold" style={{ color: colors.background }}>
            Fund wallet
          </Text>
        </Pressable>
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Wallet balance">
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
  },
  fundButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  pressed: {
    opacity: 0.85,
  },
});