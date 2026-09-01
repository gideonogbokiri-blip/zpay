import { buildReceiptText, buildSupportText } from '@/lib/receipt';
import type { Transaction } from '@/lib/api';

const transaction: Transaction = {
  id: 'tx_1',
  reference: 'ZP_123',
  userId: 'u1',
  service: 'AIRTIME',
  serviceName: 'Airtime',
  amount: 500,
  fee: 0,
  total: 500,
  currency: 'NGN',
  paymentMethod: 'wallet',
  status: 'successful',
  providerReference: 'PRV_123',
  customerIdentifier: '08012345678',
  metadata: null,
  createdAt: '2026-08-31T12:00:00.000Z',
  updatedAt: '2026-08-31T12:00:00.000Z',
};

describe('receipt text builders', () => {
  it('builds complete shareable receipt text', () => {
    const text = buildReceiptText(transaction);

    expect(text).toContain('ZPAY Receipt');
    expect(text).toContain('Reference: ZP_123');
    expect(text).toContain('Provider reference: PRV_123');
    expect(text).toContain('Customer / service ID: 08012345678');
    expect(text).toContain('Payment method: ZPAY Wallet');
  });

  it('builds support text with transaction context', () => {
    const text = buildSupportText(transaction);

    expect(text).toContain('ZPAY transaction support request');
    expect(text).toContain('Reference: ZP_123');
    expect(text).toContain('Status: successful');
    expect(text).toContain('Describe the issue:');
  });
});
