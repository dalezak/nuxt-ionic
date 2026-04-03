import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import sharePinterest from '../../app/utils/share-pinterest.js';

describe('sharePinterest', () => {
  let windowOpen;

  beforeEach(() => {
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens pinterest pin/create URL', () => {
    sharePinterest({ title: '', description: '', url: '', image: '' });
    const [url, target] = windowOpen.mock.calls[0];
    expect(url).toContain('pinterest.com/pin/create');
    expect(target).toBe('_blank');
  });

  it('includes url param when url is provided', () => {
    sharePinterest({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('url=');
    expect(url).toContain(encodeURIComponent('https://example.com'));
  });

  it('combines title and description into description param', () => {
    sharePinterest({ title: 'My Title', description: 'My Desc', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('description=');
    expect(url).toContain(encodeURIComponent('My Title - My Desc'));
  });

  it('omits description param when title and description are empty', () => {
    sharePinterest({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).not.toContain('description=');
  });
});
