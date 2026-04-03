import { describe, it, expect } from 'vitest';
import hasFunction from '../../app/utils/has-function.js';

describe('hasFunction', () => {
  it('returns true when method exists on object', () => {
    expect(hasFunction({ greet: () => {} }, 'greet')).toBe(true);
  });

  it('returns false when method does not exist on object', () => {
    expect(hasFunction({}, 'greet')).toBe(false);
  });

  it('returns false when property exists but is not a function', () => {
    expect(hasFunction({ name: 'alice' }, 'name')).toBe(false);
  });

  it('returns false when object is null', () => {
    expect(hasFunction(null, 'greet')).toBe(false);
  });

  it('returns false when object is undefined', () => {
    expect(hasFunction(undefined, 'greet')).toBe(false);
  });

  it('returns true for built-in methods', () => {
    expect(hasFunction([], 'push')).toBe(true);
  });
});
