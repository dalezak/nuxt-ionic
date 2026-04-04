/**
 * Opens a URL in a new tab, handling all common scheme types.
 * - `mailto:` and `tel:` are passed through directly.
 * - `http://` and `https://` URLs are opened as-is.
 * - Bare domains (no scheme) are prefixed with `http://`.
 * @param {string} url - The URL to open.
 * @example
 * openUrl('https://example.com');
 * openUrl('example.com');        // becomes http://example.com
 * openUrl('mailto:a@b.com');
 */
export default function (url) {
  if (process.client) {
    if (url.startsWith("mailto:")) {
      window.open(url, "_blank");
    }
    else if (url.startsWith("tel:")) {
      window.open(url, "_blank");
    }
    else if (url.startsWith("http")) {
      window.open(url, "_blank");
    }
    else {
      window.open("http://" + url, "_blank");
    }
  }
}
