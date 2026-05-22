/**
 * Truncates a string to `length` characters and appends a clamp string.
 * Returns "" for null/undefined. Returns the original string if it fits within `length`.
 *
 * Breaks on the nearest word boundary when the raw cut would split a word —
 * "Worth sitting with what" → "Worth..." rather than "Worth sitti...". The
 * back-up is capped at half the requested length so very-long words don't
 * collapse the preview to a few characters.
 *
 * Trailing whitespace and dangling punctuation are stripped before the clamp
 * is appended so the result reads as a natural pause rather than a chopped
 * sentence.
 *
 * @param {string} text - The string to truncate.
 * @param {number} length - Maximum character count before truncating (default: 100).
 * @param {string} clamp - String appended after truncation (default: "...").
 * @returns {string}
 * @example
 * textTruncate('Hello World', 5)       // → 'Hello...'
 * textTruncate('Hello World', 7)       // → 'Hello...'  (word boundary, not 'Hello W...')
 * textTruncate('Hello World', 5, '…')  // → 'Hello…'
 */
export default function (text, length = 100, clamp = "...") {
  if (!text) return "";
  if (text.length <= length) return text;
  let cut = text.substring(0, length);
  // Only trim back to a word boundary if the raw cut splits a word — i.e.
  // the next character in the source is non-whitespace. Cap the back-up at
  // half the limit so a single long word doesn't gut the preview.
  if (/\S/.test(text.charAt(length))) {
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > length / 2) cut = cut.substring(0, lastSpace);
  }
  // Strip trailing whitespace/punctuation so the clamp reads as a pause,
  // not a chopped fragment.
  cut = cut.replace(/[\s,;:.\-—]+$/, '');
  return cut + clamp;
}