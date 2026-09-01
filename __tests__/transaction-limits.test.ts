import {
  assessTransactionLimit,
  getTransactionLimit,
  transactionLimitSummary,
} from '@/lib/security/transaction-limits';

describe('transaction limits', () => {
  it('uses tier-based transaction limits', () => {
    expect(getTransactionLimit('unverified')).toBe(5000);
    expect(getTransactionLimit('basic')).toBe(50000);
    expect(getTransactionLimit('verified')).toBe(500000);
  });

  it('allows payments at or below the current tier limit', () => {
    expect(assessTransactionLimit(5000, 'unverified')).toMatchObject({
      allowed: true,
      message: null,
    });
  });

  it('blocks payments above the current tier limit', () => {
    const assessment = assessTransactionLimit(5001, 'unverified');

    expect(assessment.allowed).toBe(false);
    expect(assessment.message).toContain('Unverified accounts can send up to');
  });

  it('formats a readable tier summary', () => {
    expect(transactionLimitSummary('basic')).toContain('Basic limit');
  });
});
