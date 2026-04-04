/**
 * Opens the device's default email client with the given address pre-filled.
 * Use for tapping a contact email address — not for composing a rich email with
 * subject/body (use `shareEmail()` for that).
 * @param {string} email - Email address, e.g. "hello@example.com".
 * @example
 * openEmail('support@example.com');
 */
export default function (email) {
  if (process.client) {
    window.open(`mailto:${email}`, "_blank");
  }
}
