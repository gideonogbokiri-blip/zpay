const NAIRA = '\u20A6';

export function formatNaira(amount: number, fractionDigits = 2): string {
  const formatted = amount.toLocaleString('en-NG', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${NAIRA}${formatted}`;
}

export function formatNairaWhole(amount: number): string {
  return formatNaira(amount, 0);
}

export function formatDate(date: string | Date): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(date: string | Date): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(value)}, ${value.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function maskReference(reference: string): string {
  return reference;
}