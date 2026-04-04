import { actionSheetController } from "@ionic/vue";

/**
 * Presents an Ionic action sheet and returns the selected action string.
 * Returns null if the user cancels or taps outside.
 * `dangers` are rendered with a destructive red style above `actions`.
 * Used internally by `shareSheet()` and directly for any confirmation-style menus.
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   actions?: string[],
 *   dangers?: string[],
 *   cancel?: boolean
 * }} options
 * @returns {Promise<string|null>} The selected action string, or null if cancelled.
 * @example
 * const action = await showActionSheet({
 *   title: 'Choose action',
 *   actions: ['Edit', 'Duplicate'],
 *   dangers: ['Delete'],
 *   cancel: true
 * });
 * if (action === 'Delete') await deleteItem();
 */
export default async function ({title = null, subtitle = null, actions = [], dangers = [], cancel = true}) {
  if (process.client) {
    let options = {
      buttons: []
    };
    if (title && title.length > 0) {
      options.header = title;
    }
    if (subtitle && subtitle.length > 0) {
      options.subHeader = subtitle;
    }
    if (dangers && dangers.length > 0) {
      for (let danger of dangers) {
        options.buttons.push({
          text: danger,
          role: "danger",
          data: {
            action: danger
          }
        });
      }
    }
    if (actions && actions.length > 0) {
      for (let action of actions) {
        options.buttons.push({
          text: action,
          data: {
            action: action
          }
        });
      }
    }
    if (cancel) {
      options.buttons.push({
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      });
    }
    const actionSheet = await actionSheetController.create(options);
    await actionSheet.present();
    const data = await actionSheet.onDidDismiss();
    return data && data.data && data.data.action ? data.data.action : null;
  }
  return null;
}