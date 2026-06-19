// login-prompt — detects the `?login` bounce param (set by the auth
// middleware when it kicks an unauthenticated user off a private route) and
// opens the login modal. This keeps the "you're prompted to log in
// immediately" behavior without a /login route. `?return` is forwarded so a
// successful auth lands the user back on the page they originally wanted.
//
// Client-only: modals need the browser + a mounted Ionic app. We check both
// the initial route (afterEach doesn't fire for it) and every later navigation.
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let handling = false;

  async function maybePrompt(to) {
    if (handling || to?.query?.login == null) return;
    const { isAuthenticated } = useAuthSession();
    if (isAuthenticated.value) return;
    handling = true;
    const returnPath = typeof to.query.return === 'string' ? to.query.return : null;
    // Strip ?login / ?return from the address bar (no router churn) so a
    // refresh or back-nav doesn't re-open the modal.
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      url.searchParams.delete('return');
      window.history.replaceState(window.history.state, '', url);
    }
    // `handling` stays set until the modal dismisses, so a concurrent
    // afterEach/app:mounted pair can't stack two modals.
    await showUserLogin(returnPath);
    handling = false;
  }

  router.afterEach((to) => { maybePrompt(to); });
  nuxtApp.hook('app:mounted', () => { maybePrompt(router.currentRoute.value); });
});
