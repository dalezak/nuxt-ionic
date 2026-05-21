/**
 * Non-blocking error toast. Logs via `consoleError` then delegates to
 * `showToast` with danger color and the title + extracted message combined.
 *
 * Signature mirrors `showAlertError` so you can swap between dialog and
 * toast presentation without changing the call site.
 *
 * @param {string} title - Short label, e.g. "Couldn't save".
 * @param {Error|string|null} content - Error instance or message string.
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * try {
 *   await sync();
 * } catch (error) {
 *   showToastError("Couldn't sync", error);
 * }
 */
export default async function (title, content = null) {
  consoleError(title, content);
  const detail = content?.message
    ?? (typeof content === 'string' ? content : null);
  const message = detail ? `${title} — ${detail}` : title;
  return showToast(message, null, 'danger');
}
