export default function (url) {
  if (process.client) {
    window.open(`mailto:${email}`, "_blank");
  }
}