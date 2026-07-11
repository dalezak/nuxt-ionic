// Drives the shared onboarding gate on EVERY authenticated app entry — not just
// one page — so onboarding fires from any tab or deep-link. Generic: it knows
// nothing about a given app's modal; it only calls useOnboardingGate(), which
// is a no-op until the app registers its modal (see the composable). Apps
// without onboarding pay nothing.
//
// This is NOT routing — it opens a modal, never redirects.
//
// Timing (mirrors this layer's other user-gated client plugins):
//   - client-only;
//   - composables resolved in the plugin body (Nuxt context is present here),
//     the closure used later inside the watcher;
//   - the watch is started from `app:mounted` so the modal controller is ready
//     before we ever present, and `immediate: true` catches a session that was
//     already restored from storage at boot;
//   - fire once, when the authenticated user first resolves.

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const user = useSupabaseUser();
  const { ensureOnboarded } = useOnboardingGate();

  nuxtApp.hook('app:mounted', () => {
    let ran = false;
    watch(
      () => user.value?.id,
      async (userId) => {
        if (!userId || ran) return;
        ran = true;
        try {
          await ensureOnboarded();
        } catch (error) {
          consoleError('onboarding-gate plugin', error);
        }
      },
      { immediate: true },
    );
  });
});
