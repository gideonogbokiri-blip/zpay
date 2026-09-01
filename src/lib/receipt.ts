import type { Transaction } from '@/lib/api';
import { formatDateTime, formatNaira } from '@/lib/format';

export function buildReceiptText(transaction: Transaction): string {
  return [
    'ZPAY Receipt',
    `Status: ${transaction.status}`,
    `Service: ${transaction.serviceName}`,
    `Amount: ${formatNaira(transaction.amount)}`,
    `Fee: ${formatNaira(transaction.fee)}`,
    `Total: ${formatNaira(transaction.total)}`,
    `Reference: ${transaction.reference}`,
    transaction.providerReference ? `Provider reference: ${transaction.providerReference}` : null,
    transaction.customerIdentifier ? `Customer / service ID: ${transaction.customerIdentifier}` : null,
    `Payment method: ZPAY Wallet`,
    `Date: ${formatDateTime(transaction.createdAt)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildSupportText(transaction: Transaction): string {
  return [
    'ZPAY transaction support request',
    `Reference: ${transaction.reference}`,
    `Service: ${transaction.serviceName}`,
    `Status: ${transaction.status}`,
    `Total: ${formatNaira(transaction.total)}`,
    transaction.customerIdentifier ? `Customer / service ID: ${transaction.customerIdentifier}` : null,
    '',
    'Describe the issue:',
  ]
    .filter((line) => line !== null)
    .join('\n');
}
