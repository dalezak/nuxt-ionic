/**
 * Logs a warning via `consoleLog` then shows it as an Ionic alert dialog.
 * Use for validation failures or expected-but-notable conditions (not errors).
 * For unexpected errors use `showAlertError()`. For silent feedback use `showToast()`.
 * @param {string} title - Alert header.
 * @param {string} message - Alert body text.
 * @returns {Promise<any>} Resolves when the alert is dismissed.
 * @example
 * if (!state.email) return showWarning('Missing Email', 'Please enter your email address.');
 */
export default async function (title, message) {
  consoleLog(title, message);
  if (process.client) {
    return await showAlert(title, message);
  }
  return null;
}