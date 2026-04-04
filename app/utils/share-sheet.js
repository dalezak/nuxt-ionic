import showActionSheet from '~/utils/show-action-sheet.js';
import shareEmail from '~/utils/share-email.js';
import shareTwitter from '~/utils/share-twitter.js';
import shareFacebook from '~/utils/share-facebook.js';
import shareLinkedIn from '~/utils/share-linked-in.js';
import sharePinterest from '~/utils/share-pinterest.js';

/**
 * Presents an Ionic action sheet listing social share options and dispatches
 * to the appropriate share util based on the user's selection.
 * Use `shareSocial()` instead when you want to prefer the native Capacitor
 * share sheet (with fallback to this).
 * @param {{title: string, description: string, url: string, image: string}} props
 * @returns {Promise<void>}
 * @example
 * await shareSheet({ title: 'My Post', description: 'Check it', url: 'https://...', image: '' });
 */
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