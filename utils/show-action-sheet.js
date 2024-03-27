import { actionSheetController } from "@ionic/vue";
export default async function (options = {}, cancel = true) {
  if (process.client) {
    let buttons = [];
    for (let label of Object.keys(options)) {
      buttons.push({
        text: label,
        data: {
          action: options[label],
        },
      });
    }
    if (cancel) {
      buttons.push({
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      });
    }
    const actionSheet = await actionSheetController.create({ 
      buttons: buttons 
    });
    await actionSheet.present();
    const data = await actionSheet.onDidDismiss();
    return data && data.data && data.data.action ? data.data.action : null;
  }
  return null;
}