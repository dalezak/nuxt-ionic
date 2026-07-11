import { describe, it, expect } from 'vitest';
import textTitle from '../../app/utils/text-title.js';

describe('textTitle', () => {
  it('returns empty string for null', () => {
    expect(textTitle(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textTitle(undefined)).toBe('');
  });

  it('title-cases a lowercase string', () => {
    expect(textTitle('hello world')).toBe('Hello World');
  });

  it('preserves all-uppercase words (acronyms)', () => {
    expect(textTitle('self in IFS')).toBe('Self In IFS');
    expect(textTitle('HELLO')).toBe('HELLO');
  });

  it('title-cases a mixed-case (non-acronym) word', () => {
    expect(textTitle('hELLO wORLD')).toBe('Hello World');
  });

  it('handles a single word', () => {
    expect(textTitle('hello')).toBe('Hello');
  });
});
