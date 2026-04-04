/**
 * Dismisses the shared Ionic loading overlay.
 * Delegates to `useLoading().dismiss()`. Safe to call even if no overlay is visible.
 * Always call in a `finally` block to ensure the spinner is dismissed after async work.
 * @param {number} delay - Milliseconds to wait before dismissing (default: 200).
 * @example
 * try {
 *   showLoading('Saving...');
 *   await saveData();
 * } finally {
 *   hideLoading();
 * }
 */
export default function (delay = 200) {
  const { dismiss } = useLoading();
  dismiss(delay);
}
