/**
 * Opens the LinkedIn shareArticle dialog in a new tab.
 * Passes `url` as the article link and combines `title` + `description` as the title param.
 * @param {{title: string, description: string, url: string, image: string}} props
 * @example
 * shareLinkedIn({ title: 'My Article', description: 'Summary', url: 'https://...', image: '' });
 */
export default function ({title, description, url, image}) {
  const link = new URL("http://www.linkedin.com/shareArticle");
  link.searchParams.append("mini", "true");
  let body = [];
  if (url && url.length > 0) {
    link.searchParams.append("url", url);
  }
  if (title && title.length > 0) {
    body.push(title);
  }
  if (description && description.length > 0) {
    body.push(description);
  }
  if (body.length > 0) {
    link.searchParams.append("title", body.join(" - "));
  }
  window.open(link.href, "_blank");
}
