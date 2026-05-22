/**
 * Formats a date string as a human-readable relative time.
 * Output examples: "just now", "5m ago", "3h ago", "2d ago", "Apr 5, 2024".
 * Returns "" for null, undefined, empty string, or invalid date strings.
 *
 * Past 7 days the output switches to an absolute short date — "365d ago"
 * carries less meaning than "Apr 5, 2024", and the calendar context is
 * usually the reason a reader is reading a stale timestamp anyway.
 *
 * For always-absolute date use `textDate()` directly. For clock time only
 * use `textTime()`.
 *
 * @param {string} text - ISO date or datetime string.
 * @returns {string}
 * @example
 * textRelative('2025-04-05T10:30:00') // → "2h ago" (recent)
 * textRelative('2024-04-05T10:30:00') // → "Apr 5, 2024" (>7 days ago)
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
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
