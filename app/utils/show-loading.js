/**
 * Shows the shared Ionic loading overlay.
 * Delegates to `useLoading().show()`. If a spinner is already visible, updates its message.
 * Always pair with `hideLoading()` in a `finally` block.
 * @param {string} message - Text displayed inside the spinner (default: "Loading...").
 * @param {number} hide - If > 0, auto-dismisses after this many ms (default: 0 = manual dismiss).
 * @returns {Promise<HTMLIonLoadingElement|null>}
 * @example
 * try {
 *   showLoading('Saving...');
 *   await saveData();
 * } finally {
 *   hideLoading();
 * }
 */
export default async function (message = "Loading...", hide = 0) {
  const { show } = useLoading();
  return show(message, hide);
}
