import { popoverController } from "@ionic/vue";

/**
 * Presents an Ionic popover anchored to the triggering DOM event and resolves on dismiss.
 * Used by `shareSocial()` to show the share-popover component on web.
 * @param {object} component - The Vue component to render inside the popover.
 * @param {Event} event - The DOM event that triggered the popover (used to position it).
 * @param {object} props - Props to pass to the component (default: {}).
 * @returns {Promise<{data: any, role: string}>} Resolves with the dismiss payload.
 * @example
 * const { data } = await showPopover(MyPopover, $event, { itemId: id });
 */
export default async function (component, event, props = {}) {
  if (process.client) {
    const popover = await popoverController.create({
      component: component,
      componentProps: props,
      event: event,
      translucent: true
    });
    await popover.present();
    return await popover.onDidDismiss();
  }
  return null;
}