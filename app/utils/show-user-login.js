/**
 * Navigates to the login page using a root transition, clearing the nav stack.
 * Use when the session expires or the user needs to re-authenticate.
 * @example
 * showUserLogin();
 */
export default function () {
  showPage("/login", false, true);
}