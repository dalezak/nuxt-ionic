export default async function ({title, description, url}) {  
  return await showActionSheet([
    {
      text: 'Twitter',
      handler: () => {
        shareTwitter({
          title: title, 
          description: description, 
          url: url
        });
      }
    },
    {
      text: 'Facebook',
      handler: () => {
        shareFacebook({
          title: title, 
          description: description, 
          url: url
        });
      }
    },
    {
      text: 'LinkedIn',
      handler: () => {
        shareLinkedIn({
          title: title, 
          description: description, 
          url: url
        });
      }
    },
    {
      text: 'Pinterest',
      handler: () => {
        sharePinterest({
          title: title, 
          description: description, 
          url: url
        });
      }
    },
    {
      text: 'Email',
      handler: () => {
        shareEmail({
          title: title, 
          description: description, 
          url: url
        });
      }
    },
    {
      text: 'Cancel',
      role: 'cancel'
    },
  ]);
}