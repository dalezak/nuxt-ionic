/**
 * Navigates to the logout page using a root transition, clearing the nav stack.
 * The logout page handles Supabase session teardown.
 * @example
 * showUserLogout();
 */
export default function () {
  showPage("/logout", false, true);
}