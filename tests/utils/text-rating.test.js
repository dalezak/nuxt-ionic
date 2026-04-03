import { describe, it, expect } from 'vitest';
import textRating from '../../app/utils/text-rating.js';

describe('textRating', () => {
  it('formats numerator with default denominator of 5', () => {
    expect(textRating(3)).toBe('3 / 5');
  });

  it('formats numerator with custom denominator', () => {
    expect(textRating(7, 10)).toBe('7 / 10');
  });

  it('formats zero numerator', () => {
    expect(textRating(0)).toBe('0 / 5');
  });

  it('formats decimal values', () => {
    expect(textRating(4.5, 5)).toBe('4.5 / 5');
  });
});
