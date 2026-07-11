// Generic first-run onboarding gate, shared by every app on this layer.
//
// The gate mechanism is generic; the modal is app-specific. An app opts in by
// registering its onboarding modal once (see registerModal), typically from a
// tiny client plugin:
//
//   // <app>/app/plugins/onboarding.client.js
//   export default defineNuxtPlugin(() => {
//     useOnboardingGate().registerModal(() => showOnboardingModal());
//   });
//
// The driver plugin (onboarding-gate.client.js, this layer) then calls
// ensureOnboarded() on every authenticated app entry — so onboarding fires
// from ANY tab or deep-link, not just one page. An app that registers no modal
// (onboarding not built yet) is a clean no-op: ensureOnboarded returns before
// touching the network.
//
// Source of truth = the DB `users.onboarded_at` column (a nuxt-supabase base
// column), NOT the device-local `useOnboardingFlag` — so it survives reinstalls
// and gives apps a real per-user audit trail (e.g. disclaimer acceptance). The
// local flag composable remains for apps that still want a device-only marker.
//
// Not routing — this shows a modal, it never redirects. Deliberately stays out
// of the router so it can't fight tab/redirect middleware.
//
// registerModal(fn): app registers its modal opener (async). Last one wins.
// ensureOnboarded():
//   - no-op if no modal registered (app hasn't opted in);
//   - loads the profile (cache-fast), confirming a not-onboarded read against
//     the DB — the cached profile can be a stale pre-onboarding row;
//   - if still not onboarded, opens the registered modal, then re-reads the
//     profile so callers render for the now-onboarded user;
//   - de-dupes concurrent callers (driver plugin + a page) via a module-level
//     in-flight promise, so two modals can never stack.

let modalFn = null;
let inflight = null;

export function useOnboardingGate() {
  const { loadProfile, profile } = useProfile();

  function registerModal(fn) {
    modalFn = typeof fn === 'function' ? fn : null;
  }

  async function ensureOnboarded() {
    // App hasn't opted in — do nothing, and don't even hit the network.
    if (!modalFn) return;

    await loadProfile();
    // Stale-cache guard: a cached pre-onboarding row reads onboarded_at null
    // even when the DB has it set. Confirm with a fresh read before gating so
    // an already-onboarded user never re-sees the modal.
    if (profile.value && !profile.value.onboarded_at) {
      await loadProfile(true);
    }
    if (!profile.value || profile.value.onboarded_at) return;

    // Someone already opened the modal — await that flow instead of stacking.
    if (inflight) return inflight;
    inflight = (async () => {
      await modalFn();
      // Re-read so every surface sees onboarded_at + freshly-seeded rows.
      await loadProfile(true);
    })();
    try {
      await inflight;
    } finally {
      inflight = null;
    }
  }

  return { registerModal, ensureOnboarded };
}
