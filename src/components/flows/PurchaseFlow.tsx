import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PaymentResultScreen, type PaymentResult } from './PaymentResultScreen';
import { PaymentSummary } from '../payment/PaymentSummary';
import { WalletBalanceSummary } from '../payment/WalletBalanceSummary';
import { Button, Input, PinInput, Screen, Text } from '../ui';
import { api, isInsufficientFunds, type DataBundle, type Provider, type ServiceType, type Transaction, type TvPackage } from '@/lib/api';
import { useKyc, usePayService, useProducts, useProviders, useWallet, type Product } from '@/hooks/queries';
import { useAuth } from '@/hooks/use-auth';
import { formatNaira } from '@/lib/format';
import { useSecurityPreferences } from '@/state/security';
import { assessTransactionLimit } from '@/lib/security/transaction-limits';
import { useTransactionPinStore, transactionPinErrorMessage } from '@/state/transaction-pin';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface PurchaseFlowProps {
  service: ServiceType;
  serviceName: string;
  fee: number;
}

type Step = 'provider' | 'customer' | 'product' | 'review' | 'pin' | 'result';

function makeIdempotencyKey(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function PurchaseFlow({ service, serviceName, fee: serviceFee }: PurchaseFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('provider');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [bundle, setBundle] = useState<Product | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult>({ kind: 'idle' });

  const { data: providers } = useProviders(service);
  const { data: products } = useProducts(service, provider?.id ?? null);
  const { data: wallet } = useWallet();
  const { data: kyc } = useKyc();
  const pay = usePayService();
  const accountFrozen = useSecurityPreferences((state) => state.accountFrozen);
  const verifyDevicePin = useTransactionPinStore((state) => state.verifyPin);

  const needsCustomer = service === 'ELECTRICITY' || service === 'TV' || service === 'AIRTIME' || service === 'DATA';

  const effectiveFee = provider?.fee ?? serviceFee;
  const effectiveAmount = service === 'DATA' || service === 'TV' ? bundle?.price ?? 0 : Number(amount) || 0;
  const total = effectiveAmount + effectiveFee;
  const limitAssessment = assessTransactionLimit(total, kyc?.tier ?? user?.verificationTier ?? 'unverified');

  const verifyCustomer = async () => {
    if (!provider) return;
    setVerifyLoading(true);
    setVerifyError(null);
    try {
      const result =
        service === 'ELECTRICITY'
          ? await api.verifyMeter(provider.id, identifier.trim())
          : await api.verifyCustomer(provider.id, identifier.trim());
      setCustomerName(result.customerName);
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : 'Verification failed. Try again.');
      setCustomerName(null);
    } finally {
      setVerifyLoading(false);
    }
  };

  const nextFromProvider = () => {
    if (needsCustomer) setStep('customer');
    else setStep('product');
  };

  const nextFromCustomer = () => setStep('product');

  const submit = async () => {
    if (accountFrozen) {
      setPinError('Outgoing payments are frozen. Unfreeze them from Security to continue.');
      return;
    }
    if (!limitAssessment.allowed) {
      setPinError(limitAssessment.message);
      return;
    }
    if (pin.length !== 4) {
      setPinError('Enter your 4-digit transaction PIN.');
      return;
    }
    const pinResult = await verifyDevicePin(user?.id, pin);
    if (pinResult !== 'verified') {
      setPinError(transactionPinErrorMessage(pinResult));
      return;
    }
    setPinError(null);
    setResult({ kind: 'processing' });
    setStep('result');
    pay.mutate(
      {
        service,
        providerId: provider?.id,
        customerIdentifier: identifier.trim() || undefined,
        amount: effectiveAmount,
        pin,
        idempotencyKey: makeIdempotencyKey(),
        metadata: provider ? { provider: provider.name } : undefined,
      },
      {
        onSuccess: (transaction: Transaction) => {
          setResult({ kind: 'success', transaction });
        },
        onError: (error) => {
          if (isInsufficientFunds(error)) {
            setResult({
              kind: 'insufficient',
              data: error.data as { balance: number; required: number; needed: number },
              message: error.message,
            });
          } else {
            setResult({ kind: 'failure', message: error.message });
          }
        },
      }
    );
  };

  if (step === 'result') {
    return (
      <Screen title={serviceName} back>
        <PaymentResultScreen
          result={result}
          onViewReceipt={(tx) => router.replace(`/tx/${tx.id}/receipt`)}
          onDone={() => router.replace('/')}
          onRetry={() => {
            setPin('');
            setStep('pin');
          }}
          onBackToService={() => {
            setPin('');
            setStep('provider');
          }}
          onHome={() => router.replace('/')}
          onFundWallet={() => router.push('/wallet/fund')}
          onCancel={() => {
            setPin('');
            setStep('review');
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen title={serviceName} back scroll>
      {step === 'provider' ? (
        <ProviderStep
          service={service}
          providers={providers ?? []}
          selected={provider?.id ?? null}
          onSelect={(p) => setProvider(p)}
          onNext={nextFromProvider}
        />
      ) : null}

      {step === 'customer' && provider ? (
        <CustomerStep
          service={service}
          identifier={identifier}
          onIdentifierChange={setIdentifier}
          customerName={customerName}
          verifyLoading={verifyLoading}
          verifyError={verifyError}
          onVerify={verifyCustomer}
          onNext={nextFromCustomer}
          nextEnabled={Boolean(customerName)}
        />
      ) : null}

      {step === 'product' && provider ? (
        <ProductStep
          service={service}
          provider={provider}
          products={products ?? []}
          amount={amount}
          onAmountChange={setAmount}
          bundle={bundle}
          onBundleChange={setBundle}
          onNext={() => setStep('review')}
          nextEnabled={
            (service === 'DATA' || service === 'TV') ? Boolean(bundle) : Number(amount) > 0
          }
        />
      ) : null}

      {step === 'review' && provider ? (
        <ReviewStep
          serviceName={serviceName}
          providerName={provider.name}
          customerIdentifier={identifier.trim() || undefined}
          customerName={customerName ?? undefined}
          productLabel={
            service === 'DATA' || service === 'TV'
              ? bundle?.name
              : formatNaira(effectiveAmount)
          }
          amount={effectiveAmount}
          fee={effectiveFee}
          total={total}
          balance={wallet?.balance ?? 0}
          canSubmit={wallet ? wallet.balance >= total : true}
          frozen={accountFrozen}
          limitMessage={limitAssessment.message}
          onBack={() => setStep('product')}
          onNext={() => setStep('pin')}
        />
      ) : null}

      {step === 'pin' && provider ? (
        <PinStep
          pin={pin}
          onPinChange={(v) => {
            setPin(v);
            setPinError(null);
          }}
          error={pinError}
          amount={effectiveAmount}
          fee={effectiveFee}
          total={total}
          onBack={() => setStep('review')}
          onSubmit={submit}
        />
      ) : null}
    </Screen>
  );
}

interface ProviderStepProps {
  service: ServiceType;
  providers: Provider[];
  selected: string | null;
  onSelect: (provider: Provider) => void;
  onNext: () => void;
}

function ProviderStep({ service, providers, selected, onSelect, onNext }: ProviderStepProps) {
  const colors = useTheme();
  return (
    <View style={styles.step}>
      <Text variant="title" style={styles.stepTitle}>
        Choose provider
      </Text>
      {providers.length === 0 ? (
        <Text variant="small" color="textMuted">
          No providers available.
        </Text>
      ) : (
        <View style={styles.options}>
          {providers.map((p) => {
            const isSelected = p.id === selected;
            return (
              <Pressable
                key={p.id}
                onPress={() => onSelect(p)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={p.name}
                style={({ pressed }) => [
                  styles.optionRow,
                  {
                    backgroundColor: isSelected ? colors.accentSoft : colors.surfaceElevated,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.optionMain}>
                  <Text variant="body" style={{ color: isSelected ? colors.accent : colors.text }}>
                    {p.name}
                  </Text>
                  {p.fee > 0 ? (
                    <Text variant="caption" color="textMuted">
                      Service fee {formatNaira(p.fee)}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.radio, { borderColor: isSelected ? colors.accent : colors.textMuted }]}>
                  {isSelected ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
      <View style={styles.stepActions}>
        <Button label="Continue" disabled={!selected} onPress={onNext} />
      </View>
    </View>
  );
}

interface CustomerStepProps {
  service: ServiceType;
  identifier: string;
  onIdentifierChange: (value: string) => void;
  customerName: string | null;
  verifyLoading: boolean;
  verifyError: string | null;
  onVerify: () => void;
  onNext: () => void;
  nextEnabled: boolean;
}

function CustomerStep({
  service,
  identifier,
  onIdentifierChange,
  customerName,
  verifyLoading,
  verifyError,
  onVerify,
  onNext,
  nextEnabled,
}: CustomerStepProps) {
  const colors = useTheme();
  const needsVerification = service === 'ELECTRICITY' || service === 'TV';
  const label =
    service === 'ELECTRICITY' ? 'Meter number' : service === 'TV' ? 'Smartcard / IUC number' : 'Phone number';
  const placeholder =
    service === 'ELECTRICITY' ? 'e.g. 10012345678' : service === 'TV' ? 'e.g. 7012345678' : 'e.g. 08031234567';
  const canContinue = needsVerification ? nextEnabled : identifier.length >= 11;

  return (
    <View style={styles.step}>
      <Text variant="title" style={styles.stepTitle}>
        Customer details
      </Text>
      <Input
        label={label}
        value={identifier}
        onChangeText={(text) => {
          onIdentifierChange(text.replace(/[^0-9]/g, ''));
        }}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={12}
        error={verifyError}
        hint={
          needsVerification
            ? 'Enter the number to verify the customer.'
            : 'Enter the phone number to top up.'
        }
      />
      {needsVerification ? (
        <Button label="Verify customer" variant="secondary" onPress={onVerify} loading={verifyLoading} />
      ) : null}
      {customerName ? (
        <View style={[styles.verified, { backgroundColor: colors.successSoft }]}>
          <Text variant="smallBold" style={{ color: colors.success }}>
            {customerName}
          </Text>
        </View>
      ) : null}
      <View style={styles.stepActions}>
        <Button label="Continue" disabled={!canContinue} onPress={onNext} />
      </View>
    </View>
  );
}

interface ProductStepProps {
  service: ServiceType;
  provider: Provider;
  products: Product[];
  amount: string;
  onAmountChange: (value: string) => void;
  bundle: Product | null;
  onBundleChange: (bundle: Product | null) => void;
  onNext: () => void;
  nextEnabled: boolean;
}

function ProductStep({
  service,
  provider,
  products,
  amount,
  onAmountChange,
  bundle,
  onBundleChange,
  onNext,
  nextEnabled,
}: ProductStepProps) {
  const colors = useTheme();
  const quickAmounts = service === 'ELECTRICITY' ? [1000, 2000, 5000, 10000] : [100, 200, 500, 1000];

  return (
    <View style={styles.step}>
      <Text variant="title" style={styles.stepTitle}>
        {service === 'DATA' || service === 'TV' ? 'Choose plan' : 'Enter amount'}
      </Text>
      {service === 'DATA' || service === 'TV' ? (
        <View style={styles.options}>
          {products.map((p) => {
            const isSelected = bundle?.id === p.id;
            const sub = service === 'DATA' ? (p as DataBundle).validity : (p as TvPackage).duration;
            return (
              <Pressable
                key={p.id}
                onPress={() => onBundleChange(isSelected ? null : p)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={p.name}
                style={({ pressed }) => [
                  styles.optionRow,
                  {
                    backgroundColor: isSelected ? colors.accentSoft : colors.surfaceElevated,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.optionMain}>
                  <Text variant="body" style={{ color: isSelected ? colors.accent : colors.text }}>
                    {p.name}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {sub} - {formatNaira(p.price)}
                  </Text>
                </View>
                <View style={[styles.radio, { borderColor: isSelected ? colors.accent : colors.textMuted }]}>
                  {isSelected ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <>
          <Input
            label="Amount (NGN)"
            value={amount}
            onChangeText={(text) => onAmountChange(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder="0"
          />
          <View style={styles.quickRow}>
            {quickAmounts.map((value) => (
              <Pressable
                key={value}
                onPress={() => onAmountChange(String(value))}
                accessibilityRole="button"
                accessibilityLabel={`Quick amount ${value}`}
                style={({ pressed }) => [
                  styles.quickChip,
                  {
                    backgroundColor: Number(amount) === value ? colors.accentSoft : colors.surfaceElevated,
                    borderColor: Number(amount) === value ? colors.accent : colors.border,
                  },
                  pressed && styles.pressed,
                ]}>
                <Text variant="smallBold" style={{ color: Number(amount) === value ? colors.accent : colors.text }}>
                  {formatNaira(value, 0)}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <View style={styles.stepActions}>
        <Button label="Continue" disabled={!nextEnabled} onPress={onNext} />
      </View>
    </View>
  );
}

interface ReviewStepProps {
  serviceName: string;
  providerName: string;
  customerIdentifier?: string;
  customerName?: string;
  productLabel?: string;
  amount: number;
  fee: number;
  total: number;
  balance: number;
  canSubmit: boolean;
  frozen: boolean;
  limitMessage: string | null;
  onBack: () => void;
  onNext: () => void;
}

function ReviewStep({
  serviceName,
  providerName,
  customerIdentifier,
  customerName,
  productLabel,
  amount,
  fee,
  total,
  balance,
  canSubmit,
  frozen,
  limitMessage,
  onBack,
  onNext,
}: ReviewStepProps) {
  return (
    <View style={styles.step}>
      <Text variant="title" style={styles.stepTitle}>
        Review & confirm
      </Text>
      <PaymentSummary
        rows={[
          { label: 'Service', value: serviceName },
          { label: 'Provider', value: providerName },
          ...(customerName ? [{ label: 'Customer', value: customerName }] : []),
          ...(customerIdentifier ? [{ label: 'Service ID', value: customerIdentifier }] : []),
          ...(productLabel ? [{ label: 'Plan / amount', value: productLabel }] : []),
          { label: 'Amount', value: formatNaira(amount) },
          { label: 'Fee', value: formatNaira(fee) },
          { label: 'Total', value: formatNaira(total), strong: true },
        ]}
      />
      <WalletBalanceSummary currentBalance={balance} total={total} remainingBalance={balance - total} />
      {frozen ? (
        <Text variant="caption" color="danger">
          Outgoing payments are frozen from Security.
        </Text>
      ) : null}
      {limitMessage ? (
        <Text variant="caption" color="danger">
          {limitMessage}
        </Text>
      ) : null}
      <View style={styles.stepActions}>
        <Button label="Pay" disabled={!canSubmit || frozen || Boolean(limitMessage)} onPress={onNext} />
        <Button label="Back" variant="ghost" onPress={onBack} />
      </View>
    </View>
  );
}

interface PinStepProps {
  pin: string;
  onPinChange: (value: string) => void;
  error: string | null;
  amount: number;
  fee: number;
  total: number;
  onBack: () => void;
  onSubmit: () => void;
}

function PinStep({ pin, onPinChange, error, amount, fee, total, onBack, onSubmit }: PinStepProps) {
  const colors = useTheme();
  return (
    <View style={styles.step}>
      <Text variant="title" style={styles.stepTitle}>
        Enter transaction PIN
      </Text>
      <PinInput length={4} value={pin} onChange={onPinChange} error={error} label="Transaction PIN" />
      <View style={[styles.pinSummary, { backgroundColor: colors.surfaceElevated }]}>
        <Text variant="small" color="textSecondary">
          {formatNaira(amount)} + {formatNaira(fee)} fee
        </Text>
        <Text variant="bodyBold">{formatNaira(total)}</Text>
      </View>
      <View style={styles.stepActions}>
        <Button label="Confirm payment" disabled={pin.length !== 4} onPress={onSubmit} />
        <Button label="Back" variant="ghost" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    gap: Spacing.xl,
    paddingTop: Spacing.md,
  },
  stepTitle: {
    marginBottom: Spacing.xs,
  },
  options: {
    gap: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  optionMain: {
    flex: 1,
    gap: Spacing.xxs,
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
  stepActions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  verified: {
    padding: Spacing.lg,
    borderRadius: Radii.md,
  },
  pinSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: Radii.md,
  },
  pressed: {
    opacity: 0.75,
  },
});
