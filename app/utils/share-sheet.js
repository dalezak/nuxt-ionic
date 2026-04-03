import showActionSheet from '~/utils/show-action-sheet.js';
import shareEmail from '~/utils/share-email.js';
import shareTwitter from '~/utils/share-twitter.js';
import shareFacebook from '~/utils/share-facebook.js';
import shareLinkedIn from '~/utils/share-linked-in.js';
import sharePinterest from '~/utils/share-pinterest.js';

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
  consoleLog("shareSheet", properties);
  let action = await showActionSheet({
    title: "Share via",
    actions: [email, twitter, facebook, linkedin, pinterest], 
    cancel: true
  });
  consoleLog("shareSheet", action);
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