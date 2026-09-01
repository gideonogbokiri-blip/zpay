import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { formatNaira } from '@/lib/format';
import { Spacing } from '@/theme/tokens';
import { Card, Text, View } from './ui';

export interface WalletCardProps {
  balance: number;
  loading?: boolean;
  onFundPress?: () => void;
  onTransferPress?: () => void;
  onPress?: () => void;
}

export function WalletCard({
  balance,
  loading,
  onFundPress,
  onTransferPress,
  onPress,
}: WalletCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <Card
      elevated
      style={styles.card}>
      <View style={styles.balanceHeader}>
        <Text variant="small" color="textMuted">
          Available Balance
        </Text>
        <Pressable
          onPress={() => setVisible(!visible)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide balance' : 'Show balance'}
          style={({ pressed }) => [styles.eyeBtn, pressed && styles.pressed]}>
          <Icon
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color="#8b9aab"
          />
        </Pressable>
      </View>

      <Pressable
        disabled={!onPress}
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel="Wallet balance"
        style={({ pressed }) => [styles.balanceWrap, pressed && styles.pressed]}>
        {loading ? (
          <Text variant="amount" color="textMuted">
            ₦------.--
          </Text>
        ) : visible ? (
          <Text variant="amount" style={styles.balanceAmount}>
            {formatNaira(balance)}
          </Text>
        ) : (
          <Text variant="amount" style={styles.balanceAmount}>
            ••••••
          </Text>
        )}
      </Pressable>

      <View style={styles.balanceActions}>
        <Pressable
          onPress={onFundPress}
          accessibilityRole="button"
          accessibilityLabel="Fund wallet"
          style={({ pressed }) => [styles.fundBtn, pressed && styles.pressed]}>
          <Icon name="add" size={18} color="#003344" />
          <Text variant="smallBold" style={styles.fundBtnText}>
            Fund Wallet
          </Text>
        </Pressable>

        <Pressable
          onPress={onTransferPress}
          accessibilityRole="button"
          accessibilityLabel="Transfer"
          style={({ pressed }) => [styles.transferBtn, pressed && styles.pressed]}>
          <Icon name="swap-horizontal" size={22} color="#00e5ff" />
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginBottom: Spacing.xxl,
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#0d1a24',
    borderColor: 'rgba(0, 229, 255, 0.15)',
    shadowColor: '#00e5ff',
    shadowOpacity: 0.08,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceWrap: {
    marginBottom: 20,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  balanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fundBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00e5ff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fundBtnText: {
    color: '#003344',
    fontWeight: '600',
    fontSize: 15,
  },
  transferBtn: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});