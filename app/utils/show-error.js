/**
 * User-facing error reporter for catch blocks — logs the error then shows
 * an Ionic alert dialog with the title + error message.
 *
 * Use this from catch blocks instead of Nuxt's built-in `showError` (auto-
 * imported from `#app`), which navigates to the full-screen error page.
 * That's almost never what a catch block wants — it crashes the user out
 * of their flow on every recoverable failure.
 *
 * Two args by convention: `(title, error)`. Error may be an Error instance,
 * a string, or null.
 *
 * @param {string} title - Alert header, e.g. "Couldn't save reflection".
 * @param {Error|string|null} error - The thrown value; renders as the alert body.
 * @returns {Promise<any>} Resolves when the alert is dismissed.
 * @example
 * try {
 *   await save();
 * } catch (error) {
 *   showError("Couldn't save", error);
 * }
 */
export default async function (title, error = null) {
  consoleError(title, error);
  const message = error?.message
    ?? (typeof error === 'string' ? error : null);
  return showAlert(title, null, message);
}
