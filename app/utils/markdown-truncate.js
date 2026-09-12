/**
 * Truncates Markdown source to `length` characters WITHOUT leaving the markup
 * half-open, then appends a clamp string.
 *
 * `textTruncate` cuts on a character count, which is the right rule for plain
 * text and the wrong one for Markdown: a cut that lands inside `**a bold
 * phrase**` leaves `**a bold` behind, and the renderer — correctly — shows the
 * user literal asterisks. The same goes for an unclosed backtick or a link
 * whose `](url)` half was cut away. The preview stops being a preview of their
 * writing and starts being a preview of the markup.
 *
 * So: cut first, then repair the tail. Emphasis that was opened gets CLOSED
 * rather than dropped — the words are the user's and they still fit, it is only
 * the closing marker that fell off the end. A half-written link is the one
 * construct that can't be closed (its URL is gone), so it degrades to its label
 * text, which is what the reader was going to see anyway.
 *
 * Only the LAST line is repaired: `markdown-lite` applies inline marks per
 * line, so a marker opened on an earlier line was already unclosed in the
 * source and rendering it literally is the faithful thing to do.
 *
 * @param {string} text - Markdown source.
 * @param {number} length - Maximum character count before truncating.
 * @param {string} clamp - Appended after truncation (default: "...").
 * @returns {string} Markdown source, safe to hand to markdownLite.
 * @example
 * markdownTruncate('It felt **completely different** today', 16)
 * // → 'It felt **completely**...'   (not 'It felt **completely...')
 */
import textTruncate from './text-truncate';

// Paired inline markers, longest first — `**` must be consumed before `*`, the
// same order `markdown-lite`'s `inline()` applies them in.
const PAIRED = ['**', '__', '`', '*'];

function isBalanced(line, marker) {
  // An even number of markers means every opener found its closer. Split is a
  // count that ignores overlap, which is what we want for a flat subset.
  return line.split(marker).length % 2 === 1;
}

// `[label](url` — or `[label` — with no complete link to close it.
function repairDanglingLink(line) {
  const open = line.lastIndexOf('[');
  if (open === -1) return line;
  const rest = line.slice(open);
  if (/^\[[^\]]*\]\([^\s)]*\)/.test(rest)) return line;  // complete, leave it
  return line.slice(0, open) + (rest.match(/^\[([^\]]*)/)?.[1] ?? '');
}

function repairTail(line) {
  let out = repairDanglingLink(line);

  // A marker sitting at the very end opened emphasis around nothing. Closing it
  // would render an empty <strong>; drop it instead.
  out = out.replace(/[*_`([]+$/, '').replace(/\s+$/, '');

  // A cut can also strand a list bullet or heading marker on its own line.
  out = out.replace(/(^|\n)\s*(?:[-*+]|\d+[.)]|#{1,4})\s*$/, '$1');

  // Close what the cut left open. `**` before `*` so a bold marker isn't
  // mistaken for two italics — masking the pairs already handled keeps the
  // single-character markers from counting the doubled ones.
  let masked = out;
  for (const marker of PAIRED) {
    if (isBalanced(masked, marker)) {
      masked = masked.split(marker).join('');  // consumed; hide from later counts
      continue;
    }
    out += marker;
    masked = (masked + marker).split(marker).join('');
  }
  return out;
}

export default function markdownTruncate(text, length = 200, clamp = '...') {
  if (!text) return '';
  const source = String(text);
  if (source.length <= length) return source;

  // Clamp is appended after the repair, so it never ends up inside the
  // emphasis we just closed.
  const cut = textTruncate(source, length, '');
  if (!cut) return '';

  const lines = cut.split('\n');
  lines[lines.length - 1] = repairTail(lines[lines.length - 1]);
  const repaired = lines.join('\n').replace(/\s+$/, '');
  return repaired ? repaired + clamp : '';
}
