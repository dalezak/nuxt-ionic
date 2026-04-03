import { describe, it, expect, vi } from 'vitest';

vi.mock('ionicons/icons', () => ({
  home: 'home-svg',
  person: 'person-svg',
  star: 'star-svg',
}));

import getIcon from '../../app/utils/get-icon.js';

describe('getIcon', () => {
  it('returns the icon value for a known name', () => {
    expect(getIcon('home')).toBe('home-svg');
  });

  it('returns the correct icon for different names', () => {
    expect(getIcon('person')).toBe('person-svg');
    expect(getIcon('star')).toBe('star-svg');
  });

  it('returns empty string when name is null', () => {
    expect(getIcon(null)).toBe('');
  });

  it('returns empty string when name is undefined', () => {
    expect(getIcon(undefined)).toBe('');
  });

  it('returns undefined for an unknown icon name', () => {
    expect(getIcon('not-a-real-icon')).toBeUndefined();
  });
});
