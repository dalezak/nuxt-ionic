export default function (email) {
  if (process.client) {
    window.open(`mailto:${email}`, "_blank");
  }
}