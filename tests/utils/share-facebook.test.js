import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import shareFacebook from '../../app/utils/share-facebook.js';

describe('shareFacebook', () => {
  let windowOpen;

  beforeEach(() => {
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens facebook sharer URL', () => {
    shareFacebook({ title: '', description: '', url: '', image: '' });
    const [url, target] = windowOpen.mock.calls[0];
    expect(url).toContain('facebook.com/sharer');
    expect(target).toBe('_blank');
  });

  it('includes u param when url is provided', () => {
    shareFacebook({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('u=');
    expect(url).toContain(encodeURIComponent('https://example.com'));
  });

  it('combines title and description into quote param', () => {
    shareFacebook({ title: 'My Title', description: 'My Desc', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('quote=');
    expect(url).toContain(encodeURIComponent('My Title - My Desc'));
  });

  it('omits quote param when title and description are empty', () => {
    shareFacebook({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).not.toContain('quote=');
  });
});
