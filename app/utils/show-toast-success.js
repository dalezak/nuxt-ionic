/**
 * Non-blocking success toast. Delegates to `showToast` with success color
 * and a default checkmark icon. Use for confirmation-style feedback —
 * saved, sent, completed, earned.
 *
 * Signature mirrors `showToastError` / `showToastWarning` so the three
 * status variants are swappable at the call site.
 *
 * @param {string} title - Short confirmation, e.g. "Saved".
 * @param {Error|string|null} content - Optional detail; rarely needed for success.
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * showToastSuccess('Saved');
 * showToastSuccess('Reflection sent', 'Friends will see it on their feed.');
 */
export default async function (title, content = null) {
  const detail = content?.message
    ?? (typeof content === 'string' ? content : null);
  const message = detail ? `${title} — ${detail}` : title;
  return showToast(message, 'checkmarkCircle', 'success');
}
