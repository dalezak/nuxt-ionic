/**
 * Returns the string in uppercase, or "" for null/undefined.
 * @param {string} text
 * @returns {string}
 * @example
 * textUpper('hello') // → 'HELLO'
 */
export default function (text) {
  return text ? text.toUpperCase() : "";
}