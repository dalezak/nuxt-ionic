import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// consoleLog is a global auto-import from the Supabase layer; stub it for tests
vi.stubGlobal('consoleLog', vi.fn());

import shareEmail from '../../app/utils/share-email.js';

describe('shareEmail', () => {
  let windowOpen;

  beforeEach(() => {
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens a mailto link with subject and body', () => {
    shareEmail({ title: 'Hello', description: 'World', url: 'https://example.com', image: '' });
    expect(windowOpen).toHaveBeenCalledOnce();
    const [url, target] = windowOpen.mock.calls[0];
    expect(url).toContain('mailto:?');
    expect(url).toContain('subject=');
    expect(url).toContain('body=');
    expect(target).toBe('_blank');
  });

  it('includes encoded title as subject', () => {
    shareEmail({ title: 'My Title', description: '', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('subject=' + encodeURI('My Title'));
  });

  it('omits subject when title is empty', () => {
    shareEmail({ title: '', description: 'Hello', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).not.toContain('subject=');
  });

  it('includes url in body when provided', () => {
    shareEmail({ title: '', description: '', url: 'https://example.com', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).toContain('body=');
    expect(url).toContain(encodeURI('https://example.com'));
  });

  it('omits body when no description, url, or image', () => {
    shareEmail({ title: 'Only Title', description: '', url: '', image: '' });
    const [url] = windowOpen.mock.calls[0];
    expect(url).not.toContain('body=');
  });
});
