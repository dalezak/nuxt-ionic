export default function (title, description, image, url) {
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