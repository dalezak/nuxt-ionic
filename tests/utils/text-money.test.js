import { describe, it, expect } from 'vitest';
import textMoney from '../../app/utils/text-money.js';

describe('textMoney', () => {
  it('returns empty string for null', () => {
    expect(textMoney(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textMoney(undefined)).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(textMoney(NaN)).toBe('');
  });

  it('returns empty string for non-numeric string', () => {
    expect(textMoney('abc')).toBe('');
  });

  it('formats integer as money', () => {
    expect(textMoney(10)).toBe('$10.00');
  });

  it('formats decimal as money', () => {
    expect(textMoney(9.99)).toBe('$9.99');
  });

  it('formats numeric string as money', () => {
    expect(textMoney('10')).toBe('$10.00');
  });

  it('formats zero as money', () => {
    expect(textMoney(0)).toBe('$0.00');
  });
});
