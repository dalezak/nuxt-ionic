import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import shareTwitter from '../../app/utils/share-twitter.js';

describe('shareTwitter', () => {
  let windowOpen;

  beforeEach(() => {
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens twitter.com intent URL', () => {
    shareTwitter({ title: 'Hello', description: '', url: '', image: '' });
    const [url, target] = windowOpen.mock.calls[0];
    expect(url).toContain('twitter.com/intent/tweet');
    expect(target).toBe('_blank');
  });

  it('includes url param when url is provided', () => {
    shareTwitter({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('url=');
    expect(url).toContain(encodeURIComponent('https://example.com'));
  });

  it('combines title and description into text param', () => {
    shareTwitter({ title: 'My Title', description: 'My Desc', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('text=');
    expect(url).toContain(encodeURIComponent('My Title - My Desc'));
  });

  it('omits text param when title and description are empty', () => {
    shareTwitter({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).not.toContain('text=');
  });
});
