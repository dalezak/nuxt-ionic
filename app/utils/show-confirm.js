/**
 * Presents an Ionic alert with Cancel / Ok buttons and invokes a callback on confirmation.
 * Use for destructive or irreversible actions that need explicit user confirmation.
 * For simple informational dialogs use `showAlert()`.
 * @param {string} title - Alert header.
 * @param {string|null} subtitle - Optional secondary header.
 * @param {string|null} message - Optional body text.
 * @param {Function} callback - Called when the user taps Ok.
 * @returns {Promise<null>}
 * @example
 * await showConfirm('Delete Item', null, 'This cannot be undone.', () => deleteItem(id));
 */
export default async function (title, subtitle = null, message = null, callback) {
  if (process.client) {
    await showAlert(title, subtitle, message, [
      {
        text: "Cancel"
      }, {
        text: "Ok",
        handler: () => {
          if (callback) {
            callback();
          }
        }
      }
    ]);
  }
  return null;
}