/**
 * A deliberately small Markdown subset — the parts people actually type into a
 * journal, a note or a reflection: headings, bold, italic, inline code, bullet
 * and numbered lists, links, and blank-line paragraphs.
 *
 * Why not a library: this renders USER-AUTHORED text. `marked` and friends emit
 * raw HTML by default (that's the point of Markdown), so using one safely means
 * pairing it with a sanitizer and keeping both patched — two dependencies and an
 * ongoing obligation, to render six constructs. Here the input is HTML-escaped
 * FIRST and only a fixed whitelist of tags is introduced afterwards, so there is
 * no path from user text to live markup. A `<script>` in an entry renders as the
 * literal characters the user typed.
 *
 * What it does NOT do, on purpose: tables, block quotes, images, reference
 * links, nested lists, raw HTML passthrough. If a surface needs those, it wants
 * a real parser and a sanitizer, not this.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, ch => ESCAPES[ch]);
}

// Inline marks, applied to already-escaped text. Order matters: bold before
// italic, or `**x**` is eaten as two italics.
function inline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>')
    // Links: only http(s), and the URL is already escaped — no javascript: path.
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Render a Markdown subset to a safe HTML string.
 * @param {string} text
 * @returns {string} HTML, safe to use with v-html (input is escaped first).
 */
export default function markdownLite(text) {
  const source = String(text ?? '').replace(/\r\n/g, '\n');
  if (!source.trim()) return '';

  const html = [];
  let list = null;   // 'ul' | 'ol' | null — the open list, if any

  const closeList = () => {
    if (list) { html.push(`</${list}>`); list = null; }
  };
  const openList = (kind) => {
    if (list !== kind) { closeList(); html.push(`<${kind}>`); list = kind; }
  };

  for (const raw of source.split('\n')) {
    const line = raw.trim();

    if (!line) { closeList(); continue; }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      // Headings cap at h3: this renders inside cards and pages that own their
      // own h1/h2, and a user's `#` shouldn't outrank the page's title.
      const level = Math.min(3, heading[1].length + 1);
      html.push(`<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^[-*+]\s+(.*)$/);
    if (bullet) {
      openList('ul');
      html.push(`<li>${inline(escapeHtml(bullet[1]))}</li>`);
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) {
      openList('ol');
      html.push(`<li>${inline(escapeHtml(numbered[1]))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inline(escapeHtml(line))}</p>`);
  }

  closeList();
  return html.join('');
}

/**
 * The same subset, flattened to plain text — for previews, titles and anywhere
 * truncation would otherwise cut a tag in half.
 * @param {string} text
 * @returns {string}
 */
export function stripMarkdown(text) {
  return String(text ?? '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .trim();
}
