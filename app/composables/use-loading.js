import { loadingController } from "@ionic/vue";

/**
 * Module-level ref so a single loading overlay is shared across all callers.
 * Calling show() while a loader is already visible updates its message in place.
 */
const loading = ref(null);

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
      if (loading.value) {
        loading.value.message = message;
      } else {
        loading.value = await loadingController.create({ message });
        await loading.value.present();
      }
      if (hide && hide > 0) {
        dismiss(hide);
      }
      return loading.value;
    }
    return null;
  };

  /** Dismiss the loading overlay after an optional delay (ms). */
  const dismiss = (delay = 200) => {
    if (process.client) {
      setTimeout(async () => {
        if (loading.value) {
          await loading.value.dismiss();
          loading.value = null;
        }
      }, delay);
    }
  };

  return { show, dismiss };
}
