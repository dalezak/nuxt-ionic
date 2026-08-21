/**
 * Formats a date string compactly, for list rows and card subtitles.
 * Output example: "Tue, Aug 19" — or "Tue, Aug 19, 2025" for a date outside the
 * current year, so old rows can't read as recent.
 *
 * Use this on cards and lists; use `textDate()` ("Wednesday, Apr 5, 2025") where
 * a date is the content rather than a label, and `textDatetime()` when the time
 * of day matters.
 *
 * Exists because surfaces were each formatting their own: love-well's Reflect
 * tab showed coach conversations as "Tue, Aug 18" while the journal card beneath
 * it — same list, same page — showed "Wednesday, Aug 19, 2026". Two dates in one
 * column, formatted differently, read as two different KINDS of thing.
 *
 * Returns "" for null, undefined, empty string, or invalid date strings.
 * @param {string|Date} value - ISO date/datetime string or a Date.
 * @returns {string}
 * @example
 * textDateShort('2026-08-19') // → "Tue, Aug 19"
 */
export default function (value, now = new Date()) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString('en-us', {
    weekday: "short",
    month: "short",
    day: "numeric",
    // Only when it isn't this year — a year on every row is noise, but its
    // absence on a two-year-old entry is a lie.
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
}
