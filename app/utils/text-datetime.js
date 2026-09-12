import parseDisplayDate from './parse-display-date.js';

/**
 * Formats a datetime string as a human-readable time string.
 * Output example: "Saturday, Apr 5, 2025 at 10:30:00 AM".
 * Returns "" for null, undefined, empty string, or invalid date strings.
 * For date only (no time) use `textDate()`.
 * @param {string} text - ISO datetime string, e.g. "2025-04-05T10:30:00".
 * @returns {string}
 * @example
 * textDatetime('2025-04-05T10:30:00') // → "Saturday, Apr 5, 2025 at 10:30:00 AM"
 */
export default function (text) {
  const date = parseDisplayDate(text);
  if (date) {
    return date.toLocaleTimeString('en-us', {
      weekday: "long", 
      year: "numeric", 
      month: "short", 
      day: "numeric"
    });
  }
  return "";
}