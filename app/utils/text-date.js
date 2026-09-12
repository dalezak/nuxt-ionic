import parseDisplayDate from './parse-display-date.js';

/**
 * Formats a date string as a human-readable date (no time component).
 * Output example: "Saturday, Apr 5, 2025".
 * Returns "" for null, undefined, empty string, or invalid date strings.
 * For date + time use `textDatetime()`.
 * @param {string} text - ISO date or datetime string, e.g. "2025-04-05" or "2025-04-05T10:30:00".
 * @returns {string}
 * @example
 * textDate('2025-04-05') // → "Saturday, Apr 5, 2025"
 */
export default function (text) {
  const date = parseDisplayDate(text);
  if (!date) return "";
  return date.toLocaleDateString('en-us', {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
