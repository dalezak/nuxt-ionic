/**
 * Formats a number as a USD dollar amount with 2 decimal places.
 * Returns "" for null, undefined, NaN, or non-numeric strings.
 * @param {number|string} amount - Numeric value or numeric string.
 * @returns {string}
 * @example
 * textMoney(9.99)  // → '$9.99'
 * textMoney(10)    // → '$10.00'
 * textMoney(null)  // → ''
 */
export default function (amount) {
  const num = parseFloat(amount);
  if (amount == null || isNaN(num)) return "";
  return `$${num.toFixed(2)}`;
}