import { alertController } from "@ionic/vue";

/**
 * Presents an Ionic alert dialog and resolves when the user dismisses it.
 * For errors use `showAlertError()`. For confirmations use `showConfirm()`.
 * For non-blocking feedback prefer `showToast()`.
 * @param {string} title - Alert header.
 * @param {string|null} subtitle - Optional secondary header.
 * @param {string|null} message - Optional body text.
 * @param {string[]|object[]} buttons - Button labels or Ionic button config objects (default: ["Ok"]).
 * @returns {Promise<any>} Resolves with the dismiss event data.
 * @example
 * await showAlert('Success', null, 'Your changes have been saved.');
 */
export default async function (title, subtitle = null, message = null, buttons = ["Ok"]) {
  if (process.client) {
    let alert = await alertController.create({
      header: title ? title : null,
      subHeader: subtitle ? subtitle : null,
      message: message ? message : null,
      buttons: buttons
    });
    await alert.present();
    return await alert.onDidDismiss();
  }
  return null;
}