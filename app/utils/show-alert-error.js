/**
 * Logs an error via `consoleError` then shows it as an Ionic alert dialog.
 * Use in catch blocks for user-visible error reporting.
 * Prefer this over `showAlert()` directly in catch blocks so errors are always logged.
 * @param {string} title - Alert header, e.g. "Problem Saving".
 * @param {string|null} subtitle - Optional secondary header.
 * @param {string|null} message - Optional detail message (e.g. error.message).
 * @param {string[]} buttons - Button labels (default: ["Ok"]).
 * @returns {Promise<any>} Resolves when the alert is dismissed.
 * @example
 * try {
 *   await saveItem();
 * } catch (error) {
 *   showAlertError('Problem Saving', null, error.message);
 * }
 */
export default async function (title, subtitle = null, message = null, buttons = ["Ok"]) {
  consoleError(title, subtitle, message);
  return showAlert(title, subtitle, message, buttons);
}