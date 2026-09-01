import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { formatNaira } from '@/lib/format';
import { useTheme } from '@/theme';
import { IconSize, Radii, Shadow, Spacing } from '@/theme/tokens';
import { Card, Text, View } from './ui';

export interface WalletCardProps {
  balance: number;
  loading?: boolean;
  onFundPress?: () => void;
  onHistoryPress?: () => void;
  onPress?: () => void;
}

export function WalletCard({
  balance,
  loading,
  onFundPress,
  onHistoryPress,
  onPress,
}: WalletCardProps) {
  const colors = useTheme();

  return (
    <Card elevated style={[styles.card, { backgroundColor: '#0b173f', borderColor: 'rgba(154,185,255,0.18)' }, Shadow]}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.shimmer} />

      <View style={styles.topRow}>
        <View style={styles.miniBrand}>
          <View style={styles.miniDot} />
          <Text variant="smallBold" color="textSecondary">
            ZPAY
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          NGN
        </Text>
      </View>

      <Pressable
        disabled={!onPress}
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel="Wallet balance"
        style={({ pressed }) => [styles.balanceWrap, pressed && styles.balancePressed]}>
        <Text variant="caption" color="textMuted">
          Available balance
        </Text>
        {loading ? (
          <Text variant="amount" color="textMuted">
            ------
          </Text>
        ) : (
          <Text variant="amount" style={styles.balanceAmount}>
            {formatNaira(balance)}
          </Text>
        )}
        <Text variant="caption" color="textMuted">
          Tap to add money and review funding options.
        </Text>
      </Pressable>

      <View style={styles.quickActions}>
        <Pressable
          onPress={onFundPress}
          accessibilityRole="button"
          accessibilityLabel="Fund wallet"
          style={({ pressed }) => [styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.12)' }, pressed && styles.pressed]}>
          <Icon name="add-circle-outline" size={IconSize.sm} color={colors.textSecondary} />
          <Text variant="smallBold" color="textSecondary">
            Deposit
          </Text>
        </Pressable>

        <Pressable
          onPress={onHistoryPress}
          accessibilityRole="button"
          accessibilityLabel="View transaction history"
          style={({ pressed }) => [styles.actionButton, { backgroundColor: 'rgba(0,244,254,0.22)' }, pressed && styles.pressed]}>
          <Icon name="receipt-outline" size={IconSize.sm} color={colors.textSecondary} />
          <Text variant="smallBold" color="textSecondary">
            History
          </Text>
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text variant="caption" color="textSecondary">
            Currency
          </Text>
          <Text variant="smallBold" style={{ color: '#8FF7FF' }}>
            NGN
          </Text>
        </View>

        <View style={styles.metaChip}>
          <Text variant="caption" color="textSecondary">
            Wallet status
          </Text>
          <Text variant="smallBold" style={{ color: colors.text }}>
            Active
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.xl,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  glowOne: {
    position: 'absolute',
    top: -34,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(124, 92, 255, 0.45)',
  },
  glowTwo: {
    position: 'absolute',
    left: -30,
    bottom: -42,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(0, 244, 254, 0.18)',
  },
  shimmer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  miniBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6AF7FF',
  },
  balanceWrap: {
    gap: Spacing.xs,
    zIndex: 1,
    borderRadius: Radii.lg,
  },
  balancePressed: {
    opacity: 0.82,
  },
  balanceAmount: {
    color: '#F5FBFF',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    zIndex: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    zIndex: 1,
  },
  metaChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pressed: {
    opacity: 0.78,
  },
});
