import { describe, it, expect } from 'vitest';
import textTruncate from '../../app/utils/text-truncate.js';

describe('textTruncate', () => {
  it('returns empty string for null', () => {
    expect(textTruncate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textTruncate(undefined)).toBe('');
  });

  it('returns text unchanged when shorter than limit', () => {
    expect(textTruncate('hello', 10)).toBe('hello');
  });

  it('returns text unchanged when equal to limit', () => {
    expect(textTruncate('hello', 5)).toBe('hello');
  });

  it('truncates text and appends clamp when longer than limit', () => {
    expect(textTruncate('hello world', 5)).toBe('hello...');
  });

  it('uses custom clamp string', () => {
    expect(textTruncate('hello world', 5, '…')).toBe('hello…');
  });

  it('defaults to limit of 100', () => {
    const short = 'a'.repeat(100);
    expect(textTruncate(short)).toBe(short);

    const long = 'a'.repeat(101);
    expect(textTruncate(long)).toBe('a'.repeat(100) + '...');
  });
});
