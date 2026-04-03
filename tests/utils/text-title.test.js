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

  it('title-cases an uppercase string', () => {
    expect(textTitle('HELLO WORLD')).toBe('Hello World');
  });

  it('title-cases a mixed-case string', () => {
    expect(textTitle('hELLO wORLD')).toBe('Hello World');
  });

  it('handles a single word', () => {
    expect(textTitle('hello')).toBe('Hello');
  });
});
