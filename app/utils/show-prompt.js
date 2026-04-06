import { alertController } from "@ionic/vue";

/**
 * Presents an Ionic alert with a text input and Cancel / Ok buttons.
 * Resolves with the entered string on Ok, or null on Cancel.
 * @param {string} title - Alert header.
 * @param {string|null} message - Optional body text.
 * @param {string} placeholder - Input placeholder text.
 * @param {string} defaultValue - Pre-filled input value.
 * @returns {Promise<string|null>}
 * @example
 * const name = await showPrompt('Create Group', 'Enter a group name:', 'Group name');
 */
export default async function (title, message = null, placeholder = '', defaultValue = '') {
  if (import.meta.client) {
    let result = null;
    const alert = await alertController.create({
      header: title,
      message: message ?? undefined,
      inputs: [{ name: 'value', type: 'text', placeholder, value: defaultValue }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Ok', handler: (data) => { result = data.value ?? null; } }
      ]
    });
    await alert.present();
    await alert.onDidDismiss();
    return result;
  }
  return null;
}
