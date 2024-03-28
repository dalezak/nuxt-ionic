export default async function ({title, description, url, image}) {
  const email = "Email";
  const twitter = "Twitter";
  const facebook = "Facebook";
  const linkedIn = "LinkedIn";
  const pinterest = "Pinterest";
  const properties = {
    title: title, 
    description: description, 
    url: url,
    image: image
  };
  let action = await showActionSheet({
    title: "Share via",
    actions: [email, twitter, facebook, linkedIn, pinterest], 
    cancel: true
  });
  if (action == email) {
    shareEmail(properties);
  }
  else if (action == twitter) {
    shareTwitter(properties);
  }
  else if (action == facebook) {
    shareFacebook(properties);
  }
  else if (action == linkedin) {
    shareLinkedIn(properties);
  }
  else if (action == pinterest) {
    sharePinterest(properties);
  }
}