export default async function ({title, description, url, image}) {
  const email = "Email";
  const twitter = "Twitter";
  const facebook = "Facebook";
  const linkedin = "LinkedIn";
  const pinterest = "Pinterest";
  const properties = {
    title: title, 
    description: description, 
    url: url,
    image: image
  };
  let action = await showActionSheet({
    title: "Share via",
    actions: [email, twitter, facebook, linkedin, pinterest], 
    cancel: true
  });
  consoleLog("shareSheet", properties);
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