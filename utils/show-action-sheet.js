import { actionSheetController } from "@ionic/vue";
export default async function (buttons = {}, cancel = true) {
  if (process.client) {
    let options = [];
    for (let button of Object.keys(buttons)) {
      options.push({
        text: button,
        handler: () => {
          buttons[button]();
        }
      });
    }
    if (cancel) {
      options.push({
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      });
    }
    const actionSheet = await actionSheetController.create({ 
      buttons: options 
    });
    await actionSheet.present();
    const data = await actionSheet.onDidDismiss();
    return data && data.data && data.data.action ? data.data.action : null;
  }
  return null;
}