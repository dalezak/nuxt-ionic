import { actionSheetController } from "@ionic/vue";
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
    if (buttons && buttons.length > 0) {
      for (let action of actions) {
        options.buttons.push({
          text: action,
          data: {
            action: action
          }
        });
      }
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