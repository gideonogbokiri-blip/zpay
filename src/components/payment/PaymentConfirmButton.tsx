import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '../Icon';
import { Text } from '../ui';
import { formatNaira } from '@/lib/format';
import { Radii, Spacing, TouchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface PaymentConfirmButtonProps {
  amount: number;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function PaymentConfirmButton({
  amount,
  label = 'Pay with ZPAY Wallet',
  disabled = false,
  loading = false,
  onPress,
}: PaymentConfirmButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.accent },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      <Icon name="lock-closed" size={16} color={colors.background} />
      <Text variant="bodyBold" style={{ color: colors.background, flex: 1 }}>
        {loading ? 'Processing...' : label}
      </Text>
      <Text variant="bodyBold" style={{ color: colors.background }}>
        {formatNaira(amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TouchTarget.standard,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});