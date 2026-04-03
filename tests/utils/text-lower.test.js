import { describe, it, expect } from 'vitest';
import textLower from '../../app/utils/text-lower.js';

describe('textLower', () => {
  it('returns empty string for null', () => {
    expect(textLower(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(textLower(undefined)).toBe('');
  });

  it('lowercases an uppercase string', () => {
    expect(textLower('HELLO')).toBe('hello');
  });

  it('lowercases a mixed-case string', () => {
    expect(textLower('Hello World')).toBe('hello world');
  });

  it('leaves an already-lowercase string unchanged', () => {
    expect(textLower('hello')).toBe('hello');
  });
});
