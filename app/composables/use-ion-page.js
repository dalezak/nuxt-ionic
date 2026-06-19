/**
 * Page helper for Ionic pages. Returns:
 *   - onPageLoad(loadFn): runs loadFn after the router is ready on first entry,
 *     then re-runs it on every subsequent tab/nav return (onIonViewWillEnter).
 *     The `initialized` guard prevents a double-load on first entry.
 *   - params: a reactive ref of the CURRENT route params — use this instead of
 *     `useRoute().params` on `[slug]` pages (see below).
 *
 * Why `params` (and not `useRoute().params`):
 * Under Ionic's router integration, on a cold/deep load (hard reload or a
 * shared deep link) `useRoute()` resolves to the tab-parent route (path '/',
 * which is aliased onto the tabs page) with EMPTY params, even though
 * `router.currentRoute` already holds the real match. A page reading
 * `useRoute().params.slug` then queries with `undefined` and shows its
 * not-found state — only on reload, never on in-app navigation (where
 * useRoute() has caught up). Reading from `router.currentRoute` is correct in
 * both cases. `await router.isReady()` in onPageLoad guarantees the match has
 * resolved before the first read.
 *
 * Usage:
 *   const { onPageLoad, params } = useIonPage();
 *   onPageLoad(loadData);                       // inside: use params.value.slug
 *   // template: `params.slug` (refs auto-unwrap)
 */
export function useIonPage() {
  const router = useRouter();

  const params = computed(() => router.currentRoute.value.params);

  function onPageLoad(loadFn) {
    let initialized = false;
    onMounted(async () => {
      await router.isReady();
      initialized = true;
      loadFn();
    });
    onIonViewWillEnter(() => { if (initialized) loadFn(); });
  }

  return { onPageLoad, params };
}
