/**
 * Opens the device's phone dialer with the given number pre-filled.
 * @param {string} telephone - Phone number, e.g. "+15551234567".
 * @example
 * openPhone('+15551234567');
 */
export default function (telephone) {
  if (process.client) {
    window.open(`tel:${telephone}`, "_blank");
  }
}
