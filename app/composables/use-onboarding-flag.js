// Tracks whether a user has completed (or dismissed) the first-run
// onboarding flow. Backed by `useStorage()` from `nuxt-supabase` so it
// works on web (indexedDB w/ localStorage fallback) AND inside Capacitor
// (where direct `localStorage` access is unreliable across native shells).
//
// Both reads and writes are async — Storage is indexedDB-backed.
//
//   const { isSeen, markSeen, reset } = useOnboardingFlag();
//   if (!(await isSeen())) {
//     await showOnboarding();
//     await markSeen();
//   }

const KEY = 'onboarding_seen';

export function useOnboardingFlag() {
  const storage = useStorage();

  async function isSeen() {
    return Boolean(await storage.get(KEY));
  }

  async function markSeen() {
    await storage.set(KEY, '1');
  }

  async function reset() {
    await storage.remove?.(KEY);
  }

  return { isSeen, markSeen, reset };
}
