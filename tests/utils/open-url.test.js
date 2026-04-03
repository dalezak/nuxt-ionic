import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import openUrl from '../../app/utils/open-url.js';

describe('openUrl', () => {
  let windowOpen;

  beforeEach(() => {
    process.client = true;
    windowOpen = vi.fn();
    vi.stubGlobal('window', { open: windowOpen });
  });

  afterEach(() => {
    delete process.client;
    vi.unstubAllGlobals();
  });

  it('opens an https URL directly', () => {
    openUrl('https://example.com');
    expect(windowOpen).toHaveBeenCalledWith('https://example.com', '_blank');
  });

  it('opens an http URL directly', () => {
    openUrl('http://example.com');
    expect(windowOpen).toHaveBeenCalledWith('http://example.com', '_blank');
  });

  it('opens a mailto: URL directly', () => {
    openUrl('mailto:test@example.com');
    expect(windowOpen).toHaveBeenCalledWith('mailto:test@example.com', '_blank');
  });

  it('opens a tel: URL directly', () => {
    openUrl('tel:+15551234567');
    expect(windowOpen).toHaveBeenCalledWith('tel:+15551234567', '_blank');
  });

  it('prepends http:// for bare domain URLs', () => {
    openUrl('example.com');
    expect(windowOpen).toHaveBeenCalledWith('http://example.com', '_blank');
  });

  it('does not open anything when process.client is false', () => {
    process.client = false;
    openUrl('https://example.com');
    expect(windowOpen).not.toHaveBeenCalled();
  });
});
