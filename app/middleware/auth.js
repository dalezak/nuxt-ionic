const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  RESET: '/reset',
  LOGOUT: '/logout',
};

export default defineNuxtRouteMiddleware(async(to, from) => {
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  const { isAuthenticated } = useAuthSession();

  consoleLog(`auth ${isAuthenticated.value ? "private" : "public" } from ${from.path} to ${to.path}`);
  if (to.path == ROUTES.LOGIN || to.path == '/tabs/login') {
    if (isAuthenticated.value) {
      return navigateTo(ROUTES.HOME);
    }
    return;
  }
  else if (to.path == ROUTES.RESET || to.path == '/tabs/reset') {
    if (isAuthenticated.value) {
      return navigateTo(ROUTES.HOME);
    }
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
    return navigateTo(ROUTES.LOGIN);
  }
  else if (isAuthenticated.value) {
    return;
  }
  else {
    return navigateTo(ROUTES.LOGIN);
  }

});