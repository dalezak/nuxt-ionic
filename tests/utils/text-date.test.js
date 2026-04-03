import { describe, it, expect } from 'vitest';
import textDate from '../../app/utils/text-date.js';

describe('textDate', () => {
  it('returns empty string for null', () => {
    expect(textDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textDate(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(textDate('')).toBe('');
  });

  it('returns empty string for invalid date string', () => {
    expect(textDate('not-a-date')).toBe('');
  });

  it('returns a non-empty string for a valid ISO date', () => {
    const result = textDate('2024-06-15');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year in the output', () => {
    const result = textDate('2024-06-15');
    expect(result).toContain('2024');
  });
});
