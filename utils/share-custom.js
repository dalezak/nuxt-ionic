export default async function (title, text, url) {
  let actionSheet = await actionSheetController.create({
    header: 'Share via',
    buttons: [
      {
        text: 'Twitter',
        handler: () => {
          shareTwitter(title, text, url);
        }
      },
      {
        text: 'Facebook',
        handler: () => {
          shareFacebook(title, text, url);
        }
      },
      {
        text: 'LinkedIn',
        handler: () => {
          shareLinkedIn(title, text, url);
        }
      },
      {
        text: 'Pinterest',
        handler: () => {
          sharePinterest(title, text, url);
        }
      },
      {
        text: 'Email',
        handler: () => {
          shareEmail(title, text, url);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      },
    ],
  });
  await actionSheet.present();
}