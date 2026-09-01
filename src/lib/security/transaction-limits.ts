import type { VerificationTier } from '@/lib/api';
import { formatNaira } from '@/lib/format';

export const TRANSACTION_LIMITS: Record<VerificationTier, number> = {
  unverified: 5000,
  basic: 50000,
  verified: 500000,
};

export interface TransactionLimitAssessment {
  allowed: boolean;
  limit: number;
  tier: VerificationTier;
  message: string | null;
}

export function getTransactionLimit(tier: VerificationTier): number {
  return TRANSACTION_LIMITS[tier];
}

export function tierLabel(tier: VerificationTier): string {
  if (tier === 'verified') return 'Verified';
  if (tier === 'basic') return 'Basic';
  return 'Unverified';
}

export function assessTransactionLimit(
  amount: number,
  tier: VerificationTier = 'unverified'
): TransactionLimitAssessment {
  const limit = getTransactionLimit(tier);
  const allowed = amount <= limit;

  return {
    allowed,
    limit,
    tier,
    message: allowed
      ? null
      : `${tierLabel(tier)} accounts can send up to ${formatNaira(limit)} per transaction. Complete KYC to raise your limit.`,
  };
}

export function transactionLimitSummary(tier: VerificationTier): string {
  return `${tierLabel(tier)} limit: ${formatNaira(getTransactionLimit(tier))} per transaction`;
}
