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

  it('breaks on a word boundary instead of mid-word', () => {
    // Raw cut at length 7 would be 'Hello W' (splits 'World') — back up to
    // the space and trim, yielding 'Hello...'.
    expect(textTruncate('Hello World', 7)).toBe('Hello...');
  });

  it('keeps a mid-word cut when backing up would lose more than half the slice', () => {
    // 'Antidisestablishmentarianism' has no spaces — backing up isn't an
    // option, so the raw cut stands.
    expect(textTruncate('Antidisestablishmentarianism', 5)).toBe('Antid...');
  });

  it('strips trailing whitespace and punctuation before the clamp', () => {
    // Cut lands on a space; strip it so the clamp reads cleanly.
    expect(textTruncate('Hello, World', 6)).toBe('Hello...');
  });

  it('does not back up when the cut already lands on a word boundary', () => {
    // Raw cut at length 5 lands at the space between words — no back-up
    // needed, just strip the trailing space.
    expect(textTruncate('hello world', 5)).toBe('hello...');
  });
});
