import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import shareLinkedIn from '../../app/utils/share-linked-in.js';

describe('shareLinkedIn', () => {
  let windowOpen;

  beforeEach(() => {
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens linkedin shareArticle URL', () => {
    shareLinkedIn({ title: '', description: '', url: '', image: '' });
    const [url, target] = windowOpen.mock.calls[0];
    expect(url).toContain('linkedin.com/shareArticle');
    expect(target).toBe('_blank');
  });

  it('always includes mini=true param', () => {
    shareLinkedIn({ title: '', description: '', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('mini=true');
  });

  it('includes url param when url is provided', () => {
    shareLinkedIn({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('url=');
    expect(url).toContain(encodeURIComponent('https://example.com'));
  });

  it('combines title and description into title param', () => {
    shareLinkedIn({ title: 'My Title', description: 'My Desc', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('title=');
    expect(url).toContain(encodeURIComponent('My Title - My Desc'));
  });
});
