import { modalController } from "@ionic/vue";

/**
 * Dismisses the currently open Ionic modal, optionally passing data back to the caller.
 * The data is returned to the `showModal()` caller via `onDidDismiss().data`.
 * @param {any} data - Optional payload to return to the component that opened the modal.
 * @returns {Promise<void>}
 * @example
 * // Inside a modal component:
 * await hideModal({ saved: true, item: updatedItem });
 */
export default async function (data = null) {
  if (process.client) {
    await modalController.dismiss(data);
  }
}