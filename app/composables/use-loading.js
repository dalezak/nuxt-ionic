import { loadingController } from "@ionic/vue";

// Short delay before dismissing the overlay. Lets the final state of the
// spinner render briefly so it doesn't blink off mid-animation.
const DEFAULT_DISMISS_DELAY_MS = 200;

/**
 * Module-level ref so a single loading overlay is shared across all callers.
 * Calling show() while a loader is already visible updates its message in place.
 */
const loading = ref(null);

// The create+present in flight, if any. `show()` is async and callers rarely
// await it, so two calls in the same tick both saw `loading.value === null`
// and each created an overlay; `dismiss()` then removed only the tracked one
// and the other stayed on screen forever (calm-parent's onboarding finish,
// "Setting things up…" stuck over Today, 2026-09-30). A second caller now
// waits for the first overlay to exist and updates its message instead.
let creating = null;

/**
 * Composable for a shared Ionic loading overlay.
 * @returns {{
 *   show: (message?: string, hide?: number) => Promise<HTMLIonLoadingElement | null>,
 *   dismiss: (delay?: number) => void
 * }}
 */
export function useLoading() {
  /**
   * Show the loading overlay.
   * @param {string} message - Text displayed inside the spinner.
   * @param {number} hide    - If > 0, auto-dismisses after this many ms.
   */
  const show = async (message = "Loading...", hide = 0) => {
    if (process.client) {
      if (creating) await creating;
      if (loading.value) {
        loading.value.message = message;
      } else {
        creating = (async () => {
          const overlay = await loadingController.create({ message });
          loading.value = overlay;
          await overlay.present();
        })();
        try {
          await creating;
        } finally {
          creating = null;
        }
      }
      if (hide && hide > 0) {
        dismiss(hide);
      }
      return loading.value;
    }
    return null;
  };

  /** Dismiss the loading overlay after an optional delay (ms). */
  const dismiss = (delay = DEFAULT_DISMISS_DELAY_MS) => {
    if (process.client) {
      setTimeout(async () => {
        // A dismiss that lands while the overlay is still being created must
        // wait for it, or it finds nothing to dismiss and the overlay appears
        // a moment later with nobody left to remove it.
        if (creating) await creating;
        if (loading.value) {
          await loading.value.dismiss();
          loading.value = null;
        }
      }, delay);
    }
  };

  return { show, dismiss };
}
