// useGreeting — time-aware greeting + first-name extraction for home / Today
// surfaces. Composes the layer's `dayPeriod()` util + `useProfile()` from
// `nuxt-supabase` (available via this layer's `extends` chain).
//
// Returns three computeds — apps mix and match:
//   - `greeting`  — "Good morning" / "Good afternoon" / "Good evening"
//   - `firstName` — profile.name's first word, or email-local-part, or "there"
//   - `period`    — 'morning' | 'afternoon' | 'evening'
//
// The computeds resolve once on setup (no reactive deps), matching the
// natural pattern apps wrote inline. They re-evaluate when the consuming
// component remounts.

export function useGreeting() {
  const { profile } = useProfile();

  const period = computed(() => dayPeriod());

  const greeting = computed(() => {
    if (period.value === 'morning') return 'Good morning';
    if (period.value === 'afternoon') return 'Good afternoon';
    return 'Good evening';
  });

  const firstName = computed(() => {
    if (profile.value?.name) return profile.value.name.split(' ')[0];
    if (profile.value?.email) return profile.value.email.split('@')[0];
    return 'there';
  });

  return { greeting, firstName, period };
}
