import type { Transaction } from '@/lib/api';
import { useSupportStore } from '@/state/support';

const mockTransaction: Transaction = {
  id: 'tx_1',
  reference: 'ZPAY-123',
  userId: 'user_1',
  service: 'AIRTIME',
  serviceName: 'Airtime',
  amount: 1000,
  fee: 10,
  total: 1010,
  currency: 'NGN',
  paymentMethod: 'wallet',
  status: 'failed',
  providerReference: null,
  customerIdentifier: '08030000000',
  metadata: null,
  createdAt: '2026-08-31T09:00:00.000Z',
  updatedAt: '2026-08-31T09:00:00.000Z',
};

describe('support tickets', () => {
  beforeEach(() => {
    const SecureStore = require('expo-secure-store');
    SecureStore.__clear();
    useSupportStore.setState({ tickets: [] });
  });

  it('creates a support ticket tied to a transaction', () => {
    const ticket = useSupportStore.getState().createTransactionTicket(mockTransaction);

    expect(ticket.transactionId).toBe(mockTransaction.id);
    expect(ticket.transactionReference).toBe(mockTransaction.reference);
    expect(ticket.status).toBe('open');
    expect(ticket.message).toContain(mockTransaction.reference);
    expect(useSupportStore.getState().tickets).toHaveLength(1);
  });

  it('returns the open ticket when the same transaction is reported again', () => {
    const firstTicket = useSupportStore.getState().createTransactionTicket(mockTransaction);
    const secondTicket = useSupportStore.getState().createTransactionTicket(mockTransaction);

    expect(secondTicket.id).toBe(firstTicket.id);
    expect(useSupportStore.getState().tickets).toHaveLength(1);
  });
});
