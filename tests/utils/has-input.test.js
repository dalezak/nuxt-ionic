import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~/utils/show-toast.js', () => ({ default: vi.fn() }));
vi.mock('~/utils/set-focus.js', () => ({ default: vi.fn() }));

import hasInput from '../../app/utils/has-input.js';
import showToast from '~/utils/show-toast.js';
import setFocus from '~/utils/set-focus.js';

describe('hasInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when value is a non-empty string', () => {
    expect(hasInput(null, 'hello')).toBe(true);
  });

  it('does not call showToast when value is valid', () => {
    hasInput(null, 'hello');
    expect(showToast).not.toHaveBeenCalled();
  });

  it('returns false when value is an empty string', () => {
    expect(hasInput(null, '')).toBe(false);
  });

  it('returns false when value is null', () => {
    expect(hasInput(null, null)).toBe(false);
  });

  it('shows default toast message when value is empty', () => {
    hasInput(null, '');
    expect(showToast).toHaveBeenCalledWith('Please enter a value');
  });

  it('shows custom toast message when provided', () => {
    hasInput(null, '', 'Email is required');
    expect(showToast).toHaveBeenCalledWith('Email is required');
  });

  it('calls setFocus when an input element is provided and value is empty', () => {
    const mockInput = {};
    hasInput(mockInput, '');
    expect(setFocus).toHaveBeenCalledWith(mockInput);
  });

  it('does not call setFocus when input is null', () => {
    hasInput(null, '');
    expect(setFocus).not.toHaveBeenCalled();
  });
});
