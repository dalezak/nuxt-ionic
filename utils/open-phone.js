export default function (url) {
  if (process.client) {
    window.open(`tel:${telephone}`, "_blank");
  }
}