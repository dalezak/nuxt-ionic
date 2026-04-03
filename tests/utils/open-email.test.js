import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import openEmail from '../../app/utils/open-email.js';

describe('openEmail', () => {
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

  it('opens a mailto: link for the given email', () => {
    openEmail('test@example.com');
    expect(windowOpen).toHaveBeenCalledWith('mailto:test@example.com', '_blank');
  });

  it('does not open anything when process.client is false', () => {
    process.client = false;
    openEmail('test@example.com');
    expect(windowOpen).not.toHaveBeenCalled();
  });
});
