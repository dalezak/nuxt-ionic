/**
 * Converts a string to title case (first letter of each word capitalised, rest
 * lowercased) — EXCEPT words that are already all-uppercase (length > 1), which
 * are left untouched so acronyms survive (IFS, NVC, CBT). Handles Unicode
 * letters via the `\p{L}` flag. Returns "" for null/undefined.
 * @param {string} text
 * @returns {string}
 * @example
 * textTitle('anxious attachment') // → 'Anxious Attachment'
 * textTitle('self in IFS')        // → 'Self In IFS'  (IFS preserved)
 * textTitle('HELLO')              // → 'HELLO'        (all-caps kept)
 */
export default function (text) {
  if (text) {
    return text.replace(/\p{L}+/gu, (word) =>
      (word.length > 1 && word === word.toUpperCase())
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
  }
  return "";
}