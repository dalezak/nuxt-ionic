export default function (telephone) {
  if (process.client) {
    window.open(`tel:${telephone}`, "_blank");
  }
}