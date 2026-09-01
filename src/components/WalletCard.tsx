import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { formatNaira } from '@/lib/format';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
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
  return (
    <Card
      elevated
      style={[styles.card, { backgroundColor: '#081027', borderColor: 'rgba(154,185,255,0.22)' }]}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.glowThree} />
      <View style={styles.sheen} />
      <View style={styles.innerBorder} />

      <View style={styles.topRow}>
        <View style={styles.miniBrand}>
          <View style={styles.miniDot} />
          <Text variant="smallBold" style={styles.brandText}>
            ZPAY
          </Text>
        </View>
        <View style={styles.currencyPill}>
          <Text variant="caption" style={styles.currencyText}>
            NGN
          </Text>
        </View>
      </View>

      <Pressable
        disabled={!onPress}
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel="Wallet balance"
        style={({ pressed }) => [styles.balanceWrap, pressed && styles.balancePressed]}>
        <Text variant="caption" style={styles.balanceLabel}>
          Available balance
        </Text>
        {loading ? (
          <Text variant="amount" style={styles.balanceLoading}>
            ₦------.--
          </Text>
        ) : (
          <Text variant="amount" style={styles.balanceAmount}>
            {formatNaira(balance)}
          </Text>
        )}
        <Text variant="caption" style={styles.balanceHint}>
          Tap to fund your wallet
        </Text>
      </Pressable>

      <View style={styles.quickActions}>
        <Pressable
          onPress={onFundPress}
          accessibilityRole="button"
          accessibilityLabel="Fund wallet"
          style={({ pressed }) => [styles.actionButton, styles.actionPrimary, pressed && styles.pressed]}>
          <Icon name="add-circle" size={IconSize.sm} color="#081027" />
          <Text variant="smallBold" style={styles.actionPrimaryText}>
            Deposit
          </Text>
        </Pressable>

        <Pressable
          onPress={onHistoryPress}
          accessibilityRole="button"
          accessibilityLabel="View transaction history"
          style={({ pressed }) => [styles.actionButton, styles.actionGhost, pressed && styles.pressed]}>
          <Icon name="receipt-outline" size={IconSize.sm} color="#EAF6FF" />
          <Text variant="smallBold" style={styles.actionGhostText}>
            History
          </Text>
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaChip, { borderColor: 'rgba(0,244,254,0.35)' }]}>
          <Text variant="caption" style={styles.metaLabel}>
            Currency
          </Text>
          <Text variant="smallBold" style={styles.metaValueAccent}>
            Nigerian Naira
          </Text>
        </View>

        <View style={[styles.metaChip, { borderColor: 'rgba(46,204,113,0.35)' }]}>
          <Text variant="caption" style={styles.metaLabel}>
            Wallet status
          </Text>
          <Text variant="smallBold" style={styles.metaValue}>
            Active
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  glowOne: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(124, 92, 255, 0.55)',
  },
  glowTwo: {
    position: 'absolute',
    left: -40,
    bottom: -50,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(0, 244, 254, 0.22)',
  },
  glowThree: {
    position: 'absolute',
    top: '38%',
    right: '28%',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 122, 212, 0.16)',
  },
  sheen: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: 220,
    height: 420,
    backgroundColor: 'rgba(255,255,255,0.06)',
    transform: [{ rotate: '18deg' }],
  },
  innerBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderRadius: 21,
    borderColor: 'rgba(255,255,255,0.08)',
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
    gap: Spacing.sm,
  },
  miniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6AF7FF',
    shadowColor: '#6AF7FF',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  brandText: {
    color: '#EAF6FF',
    letterSpacing: 2.4,
    fontWeight: '700',
    fontSize: 13,
  },
  currencyPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0,244,254,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0,244,254,0.3)',
  },
  currencyText: {
    color: '#8FF7FF',
    fontWeight: '700',
  },
  balanceWrap: {
    gap: Spacing.xs,
    zIndex: 1,
    borderRadius: Radii.lg,
  },
  balancePressed: {
    opacity: 0.82,
  },
  balanceLabel: {
    color: 'rgba(234,246,255,0.7)',
    letterSpacing: 0.6,
  },
  balanceHint: {
    color: 'rgba(234,246,255,0.55)',
  },
  balanceAmount: {
    color: '#F5FBFF',
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700',
    fontFamily: 'System',
  },
  balanceLoading: {
    color: 'rgba(234,246,255,0.4)',
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
    gap: Spacing.sm,
  },
  actionPrimary: {
    backgroundColor: '#8FF7FF',
  },
  actionPrimaryText: {
    color: '#081027',
    fontWeight: '700',
  },
  actionGhost: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  actionGhostText: {
    color: '#EAF6FF',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    zIndex: 1,
  },
  metaChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.xxs,
  },
  metaLabel: {
    color: 'rgba(234,246,255,0.55)',
  },
  metaValue: {
    color: '#EAF6FF',
  },
  metaValueAccent: {
    color: '#8FF7FF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});