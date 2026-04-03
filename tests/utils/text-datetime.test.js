import { describe, it, expect } from 'vitest';
import textDatetime from '../../app/utils/text-datetime.js';

describe('textDatetime', () => {
  it('returns empty string for null', () => {
    expect(textDatetime(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textDatetime(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(textDatetime('')).toBe('');
  });

  it('returns empty string for invalid date string', () => {
    expect(textDatetime('not-a-date')).toBe('');
  });

  it('returns a non-empty string for a valid ISO datetime', () => {
    const result = textDatetime('2024-06-15T10:30:00');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes AM or PM in the output', () => {
    const result = textDatetime('2024-06-15T10:30:00');
    expect(result).toMatch(/AM|PM/i);
  });
});
