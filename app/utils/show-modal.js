import { modalController } from "@ionic/vue";

/**
 * Presents an Ionic modal and resolves with the data passed to `hideModal()`.
 * @param {object} component - The Vue component to render inside the modal.
 * @param {object} props - Props to pass to the component (default: {}).
 * @param {string[]} cssClasses - Additional CSS classes for the modal (default: []).
 * @returns {Promise<{data: any, role: string}>} Resolves with the dismiss payload from `hideModal()`.
 * @example
 * const { data } = await showModal(EditItemModal, { itemId: id });
 * if (data?.saved) refreshList();
 */
export default async function (component, props = {}, cssClasses = []) {
  if (process.client) {
    let modal = await modalController.create({
      component: component,
      componentProps: props,
      cssClass: cssClasses.join(" ")
    });
    await modal.present();
    return await modal.onDidDismiss();
  }
  return null;
}