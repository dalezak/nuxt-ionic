import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import openPhone from '../../app/utils/open-phone.js';

describe('openPhone', () => {
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

  it('opens a tel: link for the given telephone number', () => {
    openPhone('+15551234567');
    expect(windowOpen).toHaveBeenCalledWith('tel:+15551234567', '_blank');
  });

  it('does not open anything when process.client is false', () => {
    process.client = false;
    openPhone('+15551234567');
    expect(windowOpen).not.toHaveBeenCalled();
  });
});
