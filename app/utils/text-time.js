/**
 * Formats a datetime string as a locale-aware clock time (no date).
 * Output example: "10:30 AM" (en-US) / "10:30" (locales without AM/PM).
 * Returns "" for null, undefined, empty string, or invalid date strings.
 *
 * For date only use `textDate()`. For both use `textDatetime()`. For "X
 * minutes ago" use `textRelative()`.
 *
 * @param {string} text - ISO datetime string, e.g. "2025-04-05T10:30:00".
 * @returns {string}
 * @example
 * textTime('2025-04-05T10:30:00') // → "10:30 AM"
 */
export default function (text) {
  if (!text) return "";
  const date = new Date(text);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
