import { describe, it, expect } from 'vitest';
import { deepLinkPath } from '../../app/composables/use-deep-links.js';

describe('deepLinkPath', () => {
  it('maps the host to the first route segment', () => {
    expect(deepLinkPath('example://today', 'example')).toBe('/today');
  });

  it('keeps nested paths and drops a trailing slash', () => {
    expect(deepLinkPath('example://practices/abc/', 'example')).toBe('/practices/abc');
  });

  it('carries the query string through', () => {
    expect(deepLinkPath('example://today?x=1', 'example')).toBe('/today?x=1');
  });

  it('opens the root for a bare scheme', () => {
    expect(deepLinkPath('example://', 'example')).toBe('/');
  });

  it('ignores any other scheme', () => {
    expect(deepLinkPath('other://today', 'example')).toBeNull();
    expect(deepLinkPath('https://example.com/today', 'example')).toBeNull();
  });
});
