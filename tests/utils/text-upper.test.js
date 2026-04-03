import { describe, it, expect } from 'vitest';
import textUpper from '../../app/utils/text-upper.js';

describe('textUpper', () => {
  it('returns empty string for null', () => {
    expect(textUpper(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textUpper(undefined)).toBe('');
  });

  it('uppercases a lowercase string', () => {
    expect(textUpper('hello')).toBe('HELLO');
  });

  it('uppercases a mixed-case string', () => {
    expect(textUpper('Hello World')).toBe('HELLO WORLD');
  });

  it('leaves an already-uppercase string unchanged', () => {
    expect(textUpper('HELLO')).toBe('HELLO');
  });
});
