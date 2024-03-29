export default function ({title, description, url, image}) {
  consoleLog("shareEmail", title, description, url, image);
  const params = {};
  if (title && title.length > 0) {
    params["subject"] = encodeURI(title);
  }
  let body = [];
  if (description && description.length > 0) {
    body.push(description);
  }
  if (image && image.length > 0) {
    body.push(image);
  }
  if (url && url.length > 0) {
    body.push(url);
  }
  if (body.length > 0) {
    params["body"] = encodeURI(body.join("\n\n"));
  }
  consoleLog("shareEmail", params);
  const query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  window.open(`mailto:?${query}`, "_blank");
}