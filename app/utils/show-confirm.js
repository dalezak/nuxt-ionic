/**
 * Presents an Ionic confirm dialog (Cancel / Ok) and RESOLVES A BOOLEAN:
 * `true` when the user confirms, `false` on cancel or backdrop/escape dismiss.
 * Optionally invokes `callback` on confirm, so both idioms work:
 *
 *   if (await showConfirm('Delete?', null, 'This cannot be undone.')) doDelete();
 *   await showConfirm('Delete?', null, '…', () => doDelete());   // callback form
 *
 * Custom button labels via `confirmText` / `cancelText`. For simple
 * informational dialogs use `showAlert()`.
 *
 * (Previously returned `null` always — every `if (await showConfirm(...))`
 * call site silently never ran its action. Returning the choice fixes them,
 * and the optional callback keeps existing callback-style callers working.)
 * @param {string} title - Alert header.
 * @param {string|null} subtitle - Optional secondary header.
 * @param {string|null} message - Optional body text.
 * @param {Function|null} callback - Optional; called when the user confirms.
 * @param {string} confirmText - Confirm button label (default "Ok").
 * @param {string} cancelText - Cancel button label (default "Cancel").
 * @returns {Promise<boolean>}
 * @example
 * if (await showConfirm('Delete Item', null, 'This cannot be undone.')) await deleteItem(id);
 */
export default async function (title, subtitle = null, message = null, callback = null, confirmText = "Ok", cancelText = "Cancel") {
  if (!process.client) return false;
  const result = await showAlert(title, subtitle, message, [
    { text: cancelText, role: "cancel" },
    {
      text: confirmText,
      role: "confirm",
      handler: () => {
        if (callback) callback();
      },
    },
  ]);
  return result?.role === "confirm";
}