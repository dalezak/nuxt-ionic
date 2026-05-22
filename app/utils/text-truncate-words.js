/**
 * Truncates a string to `count` words and appends a clamp string.
 * Returns "" for null/undefined. Returns the original string unchanged if
 * it has `count` or fewer words.
 *
 * Words are runs of non-whitespace characters; collapsing whitespace
 * during truncation means the result uses single-space separators even if
 * the source had tabs or newlines. Trailing punctuation on the last kept
 * word is stripped before the clamp so the result reads as a pause
 * rather than a stutter ("Hello, world... " → "Hello, world...").
 *
 * Sibling to `textTruncate` — that one bounds visual width (characters);
 * this one bounds semantic content (words). Pick by what you're budgeting:
 *   - Card preview with fixed visual real estate → textTruncate
 *   - TL;DR / headline / first-N-words extract → textTruncateWords
 *
 * @param {string} text - The string to truncate.
 * @param {number} count - Maximum word count before truncating (default: 20).
 * @param {string} clamp - String appended after truncation (default: "...").
 * @returns {string}
 * @example
 * textTruncateWords('one two three four', 2)       // → 'one two...'
 * textTruncateWords('one two three four', 4)       // → 'one two three four'
 * textTruncateWords('one two three four', 2, '…')  // → 'one two…'
 * textTruncateWords('Hello, world. How are you?', 2) // → 'Hello, world...'
 */
export default function (text, count = 20, clamp = "...") {
  if (!text) return "";
  const words = text.match(/\S+/g) ?? [];
  if (words.length <= count) return text;
  const kept = words.slice(0, count).join(' ').replace(/[\s,;:.\-—]+$/, '');
  return kept + clamp;
}
