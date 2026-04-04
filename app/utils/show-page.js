import { useNuxtApp } from '#imports';

/**
 * Navigates to a path using the Ionic router ($ionRouter) for proper stack animations.
 * Use this instead of `useRouter().push()` so Ionic plays the correct slide animation.
 * - `root: true`  → replaces the entire nav stack (use after login/logout).
 * - `push: true`  → forward push animation (default, use for drilling into detail pages).
 * - `push: false` → back pop animation (use for back navigation).
 * @param {string} path - Route path to navigate to, e.g. "/tabs/home".
 * @param {boolean} push - If true, forward push; if false, back pop (default: true).
 * @param {boolean} root - If true, replaces the entire history stack (default: false).
 * @example
 * showPage('/tabs/home');           // forward push
 * showPage('/tabs/home', false);    // back pop
 * showPage('/tabs/home', false, true); // root replace (after login)
 */
export default function (path, push = true, root = false) {
  const { $ionRouter } = useNuxtApp();
  if (root) {
    $ionRouter.navigate(path, "root", "replace");
  }
  else if (push) {
    $ionRouter.navigate(path, "forward", "push");
  }
  else {
    $ionRouter.navigate(path, "back", "pop");
  }
}