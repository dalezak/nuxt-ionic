/**
 * User-facing warning alert. Logs via `consoleLog` then shows an Ionic
 * alert dialog with the title + extracted message. For validation failures
 * or expected-but-notable conditions (not errors).
 *
 * Accepts an Error instance (uses `.message`) or a plain string —
 * symmetric with showAlertError.
 *
 * @param {string} title - Alert header.
 * @param {Error|string|null} content - Error instance or message string.
 * @returns {Promise<any>} Resolves when the alert is dismissed.
 * @example
 * if (!state.email) return showAlertWarning('Missing Email', 'Please enter your email address.');
 */
export default async function (title, content = null) {
  consoleLog(title, content);
  const message = content?.message
    ?? (typeof content === 'string' ? content : null);
  if (import.meta.client) {
    return await showAlert(title, null, message);
  }
  return null;
}