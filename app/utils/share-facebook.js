/**
 * Opens the Facebook sharer dialog in a new tab.
 * Passes `url` as the shared link and combines `title` + `description` as the quote.
 * @param {{title: string, description: string, url: string, image: string}} props
 * @example
 * shareFacebook({ title: 'My Post', description: 'Check it out', url: 'https://...', image: '' });
 */
export default function ({title, description, url, image}) {
  const link = new URL("https://www.facebook.com/sharer/sharer.php");
  let body = [];
  if (url && url.length > 0) {
    link.searchParams.append("u", url);
  }
  if (title && title.length > 0) {
    body.push(title);
  }
  if (description && description.length > 0) {
    body.push(description);
  }
  if (body.length > 0) {
    link.searchParams.append("quote", body.join(" - "));
  }
  window.open(link.href, "_blank");
}
