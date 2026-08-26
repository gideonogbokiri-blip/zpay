import { StyleSheet, View } from 'react-native';

import { Icon } from '../Icon';
import { Button, Text } from '../ui';
import { IconSize, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface PaymentFailureProps {
  message?: string;
  charged?: boolean;
  onRetry?: () => void;
  onBackToService?: () => void;
  onHome?: () => void;
}

export function PaymentFailure({
  message = 'We could not complete your payment. Please try again.',
  charged = false,
  onRetry,
  onBackToService,
  onHome,
}: PaymentFailureProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
        <Icon name="close" size={IconSize.xxl} color={colors.danger} />
      </View>
      <Text variant="heading" style={styles.title}>
        Payment Failed
      </Text>
      <Text variant="body" color="textSecondary" style={styles.message}>
        {message}
      </Text>

      <View style={[styles.chargedBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Icon name="information-circle-outline" size={IconSize.md} color={colors.textSecondary} />
        <Text variant="small" color="textSecondary" style={styles.chargedText}>
          {charged
            ? 'Your wallet may have been charged. Check your transaction history before retrying.'
            : 'No funds were deducted from your wallet.'}
        </Text>
      </View>

      <View style={styles.actions}>
        {onRetry ? <Button label="Retry" onPress={onRetry} /> : null}
        {onBackToService ? (
          <Button label="Back to Service" variant="secondary" onPress={onBackToService} />
        ) : null}
        {onHome ? <Button label="Return Home" variant="ghost" onPress={onHome} /> : null}
      </View>
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
  chargedBox: {
    alignSelf: 'stretch',
    marginTop: Spacing.xl,
    borderRadius: Spacing.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  chargedText: {
    flex: 1,
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    marginTop: Spacing.xxxl,
  },
});