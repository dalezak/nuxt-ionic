// useGreeting — time-aware greeting + first-name extraction for home / Today
// surfaces. Composes the layer's `dayPeriod()` util + `useProfile()` from
// `nuxt-supabase` (available via this layer's `extends` chain).
//
// Returns three computeds — apps mix and match:
//   - `greeting`  — "Good morning" / "Good afternoon" / "Good evening"
//   - `firstName` — profile.name's first word, or email-local-part, or "there"
//   - `period`    — 'morning' | 'afternoon' | 'evening'
//
// `firstName` resolves at setup (profile-derived, server/client agree). `period`
// is resolved CLIENT-SIDE only (onMounted): during SSR + the first hydration
// render it's null → a neutral, time-free greeting, so server and client render
// identically; onMounted then fills in the real time-of-day. Computing it at
// setup would bake the SERVER's clock (UTC on most hosts) into the HTML and
// mismatch the client's local time — a daily hydration mismatch for any non-UTC
// user near a period boundary ("Good morning" SSR vs "Good evening" client).

export function useGreeting() {
  const { profile } = useProfile();

  const period = ref(null);
  onMounted(() => { period.value = dayPeriod(); });

  const greeting = computed(() => {
    if (period.value === 'morning') return 'Good morning';
    if (period.value === 'afternoon') return 'Good afternoon';
    if (period.value === 'evening') return 'Good evening';
    return 'Hello'; // neutral SSR / first-paint value — no clock leaked
  });

  const firstName = computed(() => {
    if (profile.value?.name) return profile.value.name.split(' ')[0];
    if (profile.value?.email) return profile.value.email.split('@')[0];
    return 'there';
  });

  return { greeting, firstName, period };
}
