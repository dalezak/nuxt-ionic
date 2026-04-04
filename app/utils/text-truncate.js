/**
 * Truncates a string to `length` characters and appends a clamp string.
 * Returns "" for null/undefined. Returns the original string if it fits within `length`.
 * @param {string} text - The string to truncate.
 * @param {number} length - Maximum character count before truncating (default: 100).
 * @param {string} clamp - String appended after truncation (default: "...").
 * @returns {string}
 * @example
 * textTruncate('Hello World', 5)       // → 'Hello...'
 * textTruncate('Hello World', 5, '…')  // → 'Hello…'
 */
export default function (text, length = 100, clamp = "...") {
  if (!text) return "";
  if (text.length > length) {
    return text.substring(0, length) + clamp;
  } 
  else {
    return text;
  }
}