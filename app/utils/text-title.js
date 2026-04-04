/**
 * Converts a string to title case (first letter of each word capitalised, rest lowercased).
 * Handles Unicode letters correctly via the `\p{L}` regex flag.
 * Returns "" for null/undefined.
 * @param {string} text
 * @returns {string}
 * @example
 * textTitle('hello world') // → 'Hello World'
 * textTitle('HELLO WORLD') // → 'Hello World'
 */
export default function (text) {
  if (text) {
    return text.replace(/\p{L}+/gu, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return "";
}