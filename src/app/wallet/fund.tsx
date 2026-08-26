import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PaymentSuccess } from '@/components/payment/PaymentSuccess';
import { PaymentFailure } from '@/components/payment/PaymentFailure';
import { ProcessingState } from '@/components/payment/ProcessingState';
import { PaymentSummary } from '@/components/payment/PaymentSummary';
import { WalletBalanceSummary } from '@/components/payment/WalletBalanceSummary';
import { Button, Input, Screen, Text } from '@/components/ui';
import { useElectricityQuickAmounts, useFundWallet, useWallet } from '@/hooks/queries';
import { formatNaira } from '@/lib/format';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

const METHODS = ['Card (Demo)', 'Bank Transfer (Demo)'];

type Stage = 'form' | 'processing' | 'success' | 'failure';

function makeIdempotencyKey(): string {
  return `fund_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function FundWalletScreen() {
  const colors = useTheme();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(METHODS[0]);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('form');
  const [failureMessage, setFailureMessage] = useState<string | undefined>();

  const { data: wallet } = useWallet();
  const { data: quickAmounts } = useElectricityQuickAmounts();
  const fund = useFundWallet();
  const quickAmountsList = quickAmounts ?? [1000, 2000, 5000, 10000];

  const parsedAmount = Number(amount);
  const valid = amount.trim().length > 0 && Number.isFinite(parsedAmount) && parsedAmount > 0;

  const submit = () => {
    if (!valid) {
      setAmountError('Enter an amount greater than zero.');
      return;
    }
    setAmountError(null);
    setStage('processing');
    fund.mutate(
      { amount: parsedAmount, method, idempotencyKey: makeIdempotencyKey() },
      {
        onSuccess: () => setStage('success'),
        onError: (error) => {
          setFailureMessage(error.message);
          setStage('failure');
        },
      }
    );
  };

  if (stage === 'processing') {
    return (
      <Screen title="Funding wallet" back>
        <ProcessingState
          title="Funding your wallet"
          message="Please wait while we process your funding. Do not close the app."
          stages={[
            'Validating payment details',
            'Processing payment',
            'Crediting your wallet',
          ]}
        />
      </Screen>
    );
  }

  if (stage === 'success' && fund.data) {
    return (
      <Screen title={undefined} back>
        <PaymentSuccess
          transaction={fund.data.transaction}
          onViewReceipt={() => router.replace(`/tx/${fund.data!.transaction.id}/receipt`)}
          onDone={() => router.replace('/')}
        />
      </Screen>
    );
  }

  if (stage === 'failure') {
    return (
      <Screen title="Funding failed" back>
        <PaymentFailure
          message={failureMessage}
          onRetry={() => {
            setStage('form');
          }}
          onBackToService={() => router.back()}
          onHome={() => router.replace('/')}
        />
      </Screen>
    );
  }

  return (
    <Screen title="Fund wallet" subtitle="Add money to your ZPAY wallet" back scroll>
      <Input
        label="Amount (NGN)"
        value={amount}
        onChangeText={(text) => {
          setAmount(text.replace(/[^0-9]/g, ''));
          setAmountError(null);
        }}
        keyboardType="number-pad"
        placeholder="0"
        error={amountError}
        hint="Minimum amount is NGN 1."
      />

      <View style={styles.quickRow}>
        {quickAmountsList.map((value) => (
          <Pressable
            key={value}
            onPress={() => {
              setAmount(String(value));
              setAmountError(null);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Quick amount ${value}`}
            style={({ pressed }) => [
              styles.quickChip,
              {
                backgroundColor: parsedAmount === value ? colors.accentSoft : colors.surfaceElevated,
                borderColor: parsedAmount === value ? colors.accent : colors.border,
              },
              pressed && styles.pressed,
            ]}>
            <Text variant="smallBold" style={{ color: parsedAmount === value ? colors.accent : colors.text }}>
              {formatNaira(value, 0)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.methods}>
        <Text variant="label" color="textSecondary">
          Payment method
        </Text>
        {METHODS.map((m) => {
          const selected = m === method;
          return (
            <Pressable
              key={m}
              onPress={() => setMethod(m)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={m}
              style={({ pressed }) => [
                styles.methodRow,
                {
                  backgroundColor: selected ? colors.accentSoft : colors.surfaceElevated,
                  borderColor: selected ? colors.accent : colors.border,
                },
                pressed && styles.pressed,
              ]}>
              <Text variant="body" style={{ color: selected ? colors.accent : colors.text }}>
                {m}
              </Text>
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? colors.accent : colors.textMuted },
                ]}>
                {selected ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summary}>
        <PaymentSummary
          rows={[
            { label: 'Amount', value: formatNaira(parsedAmount || 0) },
            { label: 'Fee', value: formatNaira(0) },
            { label: 'Total', value: formatNaira(parsedAmount || 0), strong: true },
          ]}
        />
        <WalletBalanceSummary
          currentBalance={wallet?.balance ?? 0}
          total={parsedAmount || 0}
          remainingBalance={(wallet?.balance ?? 0) - (parsedAmount || 0)}
        />
      </View>

      <View style={styles.actions}>
        <Button
          label={`Fund ${valid ? formatNaira(parsedAmount) : 'wallet'}`}
          onPress={submit}
          disabled={!valid}
          loading={fund.isPending}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  quickChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  methods: {
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  summary: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  actions: {
    marginTop: Spacing.xxl,
  },
  pressed: {
    opacity: 0.75,
  },
});