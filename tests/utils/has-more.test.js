import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import hasMore from '../../app/utils/has-more.js';

describe('hasMore', () => {
  beforeEach(() => {
    process.client = true;
  });

  afterEach(() => {
    delete process.client;
  });

  it('returns false when items is null', () => {
    expect(hasMore(null, 10)).toBe(false);
  });

  it('returns false when items is empty', () => {
    expect(hasMore([], 10)).toBe(false);
  });

  it('returns false when count is less than limit', () => {
    expect(hasMore([1, 2, 3], 10)).toBe(false);
  });

  it('returns false when count is an exact multiple of limit', () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    expect(hasMore(items, 10)).toBe(false);
  });

  it('returns true when count exceeds a full page with a partial remainder', () => {
    const items = Array.from({ length: 13 }, (_, i) => i);
    expect(hasMore(items, 10)).toBe(true);
  });

  it('returns false when process.client is false', () => {
    process.client = false;
    const items = Array.from({ length: 13 }, (_, i) => i);
    expect(hasMore(items, 10)).toBe(false);
  });
});
