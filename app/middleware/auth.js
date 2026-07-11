const ROUTES = {
  HOME: '/',
  RESET: '/reset',
  LOGOUT: '/logout',
};

export default defineNuxtRouteMiddleware(async(to, from) => {
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  const { isAuthenticated } = useAuthSession();

  // Bounce an unauthenticated user off a private route onto the first public
  // tab (e.g. the start page). `?login` triggers the login-prompt plugin to
  // auto-open the login modal; `?return` lands them back on the page they
  // wanted once they authenticate. (Login is a modal now, not a route.)
  const publicTab = tabs.find(tab => tab.public == true);
  const loginBounce = (returnPath) => navigateTo({
    path: publicTab?.path ?? ROUTES.HOME,
    query: { login: '1', return: returnPath },
  });

  consoleLog(`auth ${isAuthenticated.value ? "private" : "public" } from ${from.path} to ${to.path}`);
  // A Supabase password-recovery link signs the user in (a recovery session)
  // BEFORE /reset renders — so bouncing authenticated users off /reset makes
  // the reset form unreachable and recovery impossible. Always allow /reset
  // through; the page owns setting the new password. (A normally-logged-in
  // user visiting /reset just gets a change-password form, which is benign.)
  if (to.path == ROUTES.RESET || to.path == '/tabs/reset') {
    return;
  }
  else if (to.path == ROUTES.LOGOUT) {
    return;
  }
  else if (page && page.public == true) {
    if (isAuthenticated.value) {
      return navigateTo(ROUTES.HOME);
    }
    return;
  }
  else if (page && page.public == false) {
    if (isAuthenticated.value) {
      return;
    }
    return loginBounce(to.path);
  }
  else if (isAuthenticated.value) {
    return;
  }
  else {
    return loginBounce(to.path);
  }

});
