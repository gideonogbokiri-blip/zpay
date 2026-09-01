import { transactionPinErrorMessage, useTransactionPinStore } from '@/state/transaction-pin';

describe('transaction PIN state', () => {
  beforeEach(() => {
    const SecureStore = require('expo-secure-store');
    SecureStore.__clear();
    useTransactionPinStore.setState({ pinsByUserId: {} });
  });

  it('stores and verifies a device PIN by user', async () => {
    await useTransactionPinStore.getState().setPin('user_1', '1234');

    await expect(useTransactionPinStore.getState().verifyPin('user_1', '1234')).resolves.toBe('verified');
    await expect(useTransactionPinStore.getState().verifyPin('user_1', '0000')).resolves.toBe('invalid');
    await expect(useTransactionPinStore.getState().verifyPin('user_2', '1234')).resolves.toBe('missing');
  });

  it('requires the current PIN before changing a stored PIN', async () => {
    await useTransactionPinStore.getState().setPin('user_1', '1234');

    await expect(useTransactionPinStore.getState().changePin('user_1', '0000', '7777')).resolves.toBe('invalid');
    await expect(useTransactionPinStore.getState().verifyPin('user_1', '1234')).resolves.toBe('verified');

    await expect(useTransactionPinStore.getState().changePin('user_1', '1234', '7777')).resolves.toBe('verified');
    await expect(useTransactionPinStore.getState().verifyPin('user_1', '7777')).resolves.toBe('verified');
  });

  it('maps verification failures to user-safe messages', () => {
    expect(transactionPinErrorMessage('missing')).toContain('Set your transaction PIN');
    expect(transactionPinErrorMessage('invalid')).toBe('Incorrect transaction PIN.');
    expect(transactionPinErrorMessage('verified')).toBe('');
  });
});
