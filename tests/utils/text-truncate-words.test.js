import { describe, it, expect } from 'vitest';
import textTruncateWords from '../../app/utils/text-truncate-words.js';

describe('textTruncateWords', () => {
  it('returns empty string for null', () => {
    expect(textTruncateWords(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textTruncateWords(undefined)).toBe('');
  });

  it('returns text unchanged when word count is below the limit', () => {
    expect(textTruncateWords('one two three', 5)).toBe('one two three');
  });

  it('returns text unchanged when word count equals the limit', () => {
    expect(textTruncateWords('one two three', 3)).toBe('one two three');
  });

  it('truncates and appends clamp when over the word limit', () => {
    expect(textTruncateWords('one two three four', 2)).toBe('one two...');
  });

  it('uses custom clamp string', () => {
    expect(textTruncateWords('one two three four', 2, '…')).toBe('one two…');
  });

  it('strips trailing punctuation on the last kept word', () => {
    expect(textTruncateWords('Hello, world. How are you?', 2)).toBe('Hello, world...');
  });

  it('collapses internal whitespace (tabs / newlines / multi-space) on truncate', () => {
    expect(textTruncateWords('one\ttwo\nthree    four', 2)).toBe('one two...');
  });

  it('treats whitespace-only input as having zero words and returns it unchanged', () => {
    expect(textTruncateWords('   ', 5)).toBe('   ');
  });

  it('defaults to a limit of 20 words', () => {
    const twenty = Array.from({ length: 20 }, (_, i) => `w${i}`).join(' ');
    expect(textTruncateWords(twenty)).toBe(twenty);

    const twentyOne = `${twenty} extra`;
    expect(textTruncateWords(twentyOne)).toBe(`${twenty}...`);
  });
});
