/**
 * Non-blocking warning toast. Logs via `consoleLog` then delegates to
 * `showToast` with warning color and the title + extracted message combined.
 *
 * Signature mirrors `showAlertWarning` so you can swap between dialog
 * and toast presentation without changing the call site.
 *
 * @param {string} title - Short label, e.g. "Missing email".
 * @param {Error|string|null} content - Error instance or message string.
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * if (!state.email) showToastWarning('Missing email', 'Please enter your email address.');
 */
export default async function (title, content = null) {
  consoleLog(title, content);
  const detail = content?.message
    ?? (typeof content === 'string' ? content : null);
  const message = detail ? `${title} — ${detail}` : title;
  return showToast(message, null, 'warning');
}
