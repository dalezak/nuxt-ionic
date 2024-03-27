export default async function ({title, description, url}) {  
  return await showActionSheet({
    "Email": () => { 
      shareEmail({
        title: title, 
        description: description, 
        url: url
      })
    },
    "Twitter": () => { 
      shareTwitter({
        title: title, 
        description: description, 
        url: url
      })
    },
    "Facebook": () => {
      shareFacebook({
        title: title, 
        description: description, 
        url: url
      })
    },
    "LinkedIn": () => { 
      shareLinkedIn({
        title: title, 
        description: description, 
        url: url
      })
    },
    "Pinterest": () => { 
      sharePinterest({
        title: title, 
        description: description, 
        url: url
      })
    }
  });
}