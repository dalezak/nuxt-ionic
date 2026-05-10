/**
 * Formats a date string as a human-readable relative time.
 * Output examples: "just now", "5m ago", "3h ago", "2d ago".
 * Returns "" for null, undefined, empty string, or invalid date strings.
 * For absolute date use `textDate()`.
 * @param {string} text - ISO date or datetime string.
 * @returns {string}
 * @example
 * textRelative('2025-04-05T10:30:00') // → "2h ago"
 */
export default function (text) {
  if (!text) return '';
  const date = new Date(text);
  if (isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins <= 0) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
