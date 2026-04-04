/**
 * Returns the string in lowercase, or "" for null/undefined.
 * @param {string} text
 * @returns {string}
 * @example
 * textLower('HELLO') // → 'hello'
 */
export default function (text) {
  return text ? text.toLowerCase() : "";
}