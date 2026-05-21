/**
 * User-facing error alert. Logs via `consoleError` then shows an Ionic
 * alert dialog with the title + extracted error message.
 *
 * Use from catch blocks instead of Nuxt's built-in `showError`
 * (auto-imported from `#app`), which navigates to the full-screen error
 * page — almost never what a catch block wants.
 *
 * @param {string} title - Alert header, e.g. "Couldn't save reflection".
 * @param {Error|string|null} content - Error instance or message string; renders as the alert body.
 * @returns {Promise<any>} Resolves when the alert is dismissed.
 * @example
 * try {
 *   await save();
 * } catch (error) {
 *   showAlertError("Couldn't save", error);
 * }
 */
export default async function (title, content = null) {
  consoleError(title, content);
  const message = content?.message
    ?? (typeof content === 'string' ? content : null);
  return showAlert(title, null, message);
}
