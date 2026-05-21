import { toastController } from "@ionic/vue";

/**
 * Shows a brief non-blocking Ionic toast notification.
 * Use for lightweight feedback (saved, copied, etc.) that doesn't require acknowledgement.
 * For messages requiring user acknowledgement use `showAlert()`. For
 * pre-colored error/warning toasts use `showToastError()` / `showToastWarning()`.
 * @param {string} message - The text to display.
 * @param {string|null} iconName - Optional Ionicons icon name (camelCase, e.g. "trophy", "bulbOutline"). Resolved via `getIcon()`.
 * @param {string|null} color - Optional Ionic color name (e.g. 'danger', 'warning', 'success').
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * showToast('Saved successfully');
 * showToast('Badge earned!', 'trophy');
 * showToast('Heads up', null, 'warning');
 */
export default async function (message, iconName = null, color = null) {
  if (import.meta.client) {
    const icon = iconName ? getIcon(iconName) : null;
    const toast = await toastController.create({
      message,
      duration: 3000,
      ...(icon && { icon }),
      ...(color && { color }),
    });
    toast.present();
    return toast;
  }
  return null;
}
