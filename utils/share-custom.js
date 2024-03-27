export default async function (title, text, url) {  
  return await showActionSheet([
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
  ]);
}