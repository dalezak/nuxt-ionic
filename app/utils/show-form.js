import { alertController } from "@ionic/vue";

/**
 * Presents an Ionic alert with multiple text inputs and Cancel / Ok buttons.
 * Resolves with a named object of field values on Ok, or null on Cancel.
 * @param {string} title - Alert header.
 * @param {object[]} fields - Array of input configs: { name, placeholder, type, value }
 * @param {string|null} message - Optional body text.
 * @returns {Promise<object|null>}
 * @example
 * const data = await showForm('Create Group', [
 *   { name: 'name', placeholder: 'Group name' },
 *   { name: 'description', placeholder: 'Description (optional)' }
 * ]);
 * if (data) console.log(data.name, data.description);
 */
export default async function (title, fields = [], message = null) {
  if (import.meta.client) {
    let result = null;
    const alert = await alertController.create({
      header: title,
      message: message ?? undefined,
      inputs: fields.map(f => ({
        name: f.name,
        type: f.type ?? 'text',
        placeholder: f.placeholder ?? '',
        value: f.value ?? '',
      })),
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Ok', handler: (data) => { result = data; } }
      ]
    });
    await alert.present();
    await alert.onDidDismiss();
    return result;
  }
  return null;
}
