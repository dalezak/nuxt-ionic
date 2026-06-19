import LoginModal from '../components/login/modal.vue';
import showModal from './show-modal.js';

/**
 * Opens the login modal (Login / Signup / Reset). Replaces the old /login
 * route. Use when the session expires, from a "Get Started" / "Login" button,
 * or via the auth middleware's `?login` bounce (see the login-prompt plugin).
 * @param {string|null} returnPath - Optional relative path to land on after a
 *   successful auth (deep-link bounce). Null → the app root.
 * @example
 * showUserLogin();                 // → root on success
 * showUserLogin('/learn/abc');     // → that path on success
 */
export default function (returnPath = null) {
  if (import.meta.client) {
    return showModal(LoginModal, { returnPath });
  }
  return null;
}
