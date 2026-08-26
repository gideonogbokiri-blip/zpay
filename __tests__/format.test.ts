import { formatDate, formatDateTime, formatNaira, formatNairaWhole } from '@/lib/format';

describe('formatNaira', () => {
  it('formats with the naira symbol and thousands separators', () => {
    expect(formatNaira(125000)).toBe('\u20A6125,000.00');
  });

  it('formats zero', () => {
    expect(formatNaira(0)).toBe('\u20A60.00');
  });

  it('supports whole naira', () => {
    expect(formatNairaWhole(125000)).toBe('\u20A6125,000');
  });
});

describe('formatDateTime', () => {
  it('formats a date with time', () => {
    const value = new Date('2026-08-19T14:30:00');
    expect(formatDateTime(value)).toContain('2026');
    expect(formatDateTime(value)).toContain(':');
  });
});

describe('formatDate', () => {
  it('includes the year', () => {
    expect(formatDate('2026-08-19')).toContain('2026');
  });
});