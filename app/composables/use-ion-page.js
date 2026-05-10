/**
 * Returns an `onPageLoad` registration function for Ionic pages.
 * - onMounted: runs loadFn on first entry and marks page as initialized
 * - onIonViewWillEnter: re-runs loadFn on every subsequent tab/nav return
 * This prevents the double-load that occurs if both hooks call loadFn unconditionally.
 *
 * Usage:
 *   const { onPageLoad } = useIonPage();
 *   onPageLoad(loadData);
 */
export function useIonPage() {
  function onPageLoad(loadFn) {
    let initialized = false;
    onMounted(() => { initialized = true; loadFn(); });
    onIonViewWillEnter(() => { if (initialized) loadFn(); });
  }

  return { onPageLoad };
}
