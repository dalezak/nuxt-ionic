/**
 * Formats a rating as "numerator / denominator".
 * @param {number} numerator - The achieved score.
 * @param {number} denominator - The maximum score (default: 5).
 * @returns {string}
 * @example
 * textRating(4, 5)  // → '4 / 5'
 * textRating(7, 10) // → '7 / 10'
 */
export default function (numerator, denominator = 5) {
  return `${numerator} / ${denominator}`;
}