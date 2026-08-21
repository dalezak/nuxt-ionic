/**
 * Formats a number for compact display — large values abbreviate with a
 * locale-aware suffix (1200 → "1.2K", 34500 → "34.5K", 2000000 → "2M"),
 * small values render as-is. Non-numbers pass through untouched, so callers
 * can feed mixed value types (a stat tile showing "∞" or a string stays
 * verbatim). Sibling of textTitle / textPluralize / textDate.
 * @param {number|string} value
 * @returns {string}
 * @example
 * textNumber(42)      // → '42'
 * textNumber(1234)    // → '1.2K'
 * textNumber('7 min') // → '7 min' (pass-through)
 */
export default function (value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return value ?? '';
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
