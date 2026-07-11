import { toastController } from "@ionic/vue";

/**
 * Shows a toast with an "Undo" affordance and a grace window, then reports
 * whether the user reached for it. This is the seam for a *fail-safe*
 * destructive action: the caller removes the item optimistically from the UI,
 * awaits this toast, and only commits the irreversible delete if the user let
 * the window pass.
 *
 * It deliberately bypasses the stacking queue in `showToast()` — an undo is a
 * singular, deferred-commit interaction (one pending action at a time), not
 * ambient confirmation, so it presents directly via `toastController`.
 *
 * @param {string} message - What just happened, past tense (e.g. "Removed").
 * @param {object} [options]
 * @param {string} [options.undoLabel='Undo'] - Label for the undo button.
 * @param {number} [options.duration=5000] - Grace window in ms before the toast
 *   auto-dismisses and the action is considered committed.
 * @param {string|null} [options.iconName=null] - Optional Ionicons icon (camelCase).
 * @returns {Promise<{undone: boolean}>} `undone: true` if the user tapped undo;
 *   `false` if the window elapsed (or dismissed otherwise) — i.e. commit the delete.
 * @example
 * // optimistic remove first, commit only if not undone
 * list.value = list.value.filter(i => i.id !== item.id);
 * const { undone } = await showToastUndo('Removed');
 * if (undone) list.value = restore(item);
 * else await item.delete();
 */
export default async function (message, { undoLabel = 'Undo', duration = 5000, iconName = null } = {}) {
  if (!import.meta.client) return { undone: false };
  const icon = iconName ? getIcon(iconName) : null;
  const toast = await toastController.create({
    message,
    duration,
    ...(icon && { icon }),
    buttons: [{ text: undoLabel, role: 'undo' }],
  });
  await toast.present();
  const { role } = await toast.onDidDismiss();
  return { undone: role === 'undo' };
}
