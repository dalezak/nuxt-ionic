import { toastController } from "@ionic/vue";

/**
 * Shows a brief non-blocking Ionic toast notification.
 * Use for lightweight feedback (saved, copied, etc.) that doesn't require acknowledgement.
 * For messages requiring user acknowledgement use `showAlert()`.
 * @param {string} message - The text to display.
 * @param {number} seconds - How long to show the toast in seconds (default: 2).
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * showToast('Saved successfully');
 * showToast('Link copied', 3);
 */
export default async function (message, seconds = 2) {
  if (process.client) {
    const toast = await toastController.create({
      message: message,
      duration: seconds * 1000
    });
    toast.present();
    return toast;
  }
  return null;
}