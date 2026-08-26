import type { ReactNode } from 'react';

import { InsufficientBalance } from '../payment/InsufficientBalance';
import { PaymentFailure } from '../payment/PaymentFailure';
import { PaymentSuccess } from '../payment/PaymentSuccess';
import { ProcessingState } from '../payment/ProcessingState';
import type { InsufficientFundsData, Transaction } from '@/lib/api';

export type PaymentResult =
  | { kind: 'idle' }
  | { kind: 'processing' }
  | { kind: 'success'; transaction: Transaction; registrationStatus?: string }
  | { kind: 'insufficient'; data: InsufficientFundsData; message: string }
  | { kind: 'failure'; message: string };

export interface PaymentResultScreenProps {
  result: PaymentResult;
  onViewReceipt?: (transaction: Transaction) => void;
  onDone?: () => void;
  onRetry?: () => void;
  onBackToService?: () => void;
  onHome?: () => void;
  onFundWallet?: () => void;
  onCancel?: () => void;
  fallback?: ReactNode;
}

export function PaymentResultScreen({
  result,
  onViewReceipt,
  onDone,
  onRetry,
  onBackToService,
  onHome,
  onFundWallet,
  onCancel,
  fallback,
}: PaymentResultScreenProps) {
  switch (result.kind) {
    case 'processing':
      return (
        <ProcessingState
          title="Processing payment"
          message="Please wait while we complete your payment. Do not close the app."
          stages={['Validating payment details', 'Contacting provider', 'Completing payment']}
        />
      );
    case 'success':
      return (
        <PaymentSuccess
          transaction={result.transaction}
          registrationStatus={result.registrationStatus}
          onViewReceipt={onViewReceipt ? () => onViewReceipt(result.transaction) : undefined}
          onDone={onDone}
        />
      );
    case 'insufficient':
      return (
        <InsufficientBalance
          balance={result.data.balance}
          required={result.data.required}
          needed={result.data.needed}
          onFundWallet={onFundWallet}
          onCancel={onCancel}
        />
      );
    case 'failure':
      return (
        <PaymentFailure
          message={result.message}
          charged={false}
          onRetry={onRetry}
          onBackToService={onBackToService}
          onHome={onHome}
        />
      );
    case 'idle':
    default:
      return fallback ?? null;
  }
}