const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  RESET: '/reset',
  LOGOUT: '/logout',
};

export default defineNuxtRouteMiddleware(async(to, from) => {
  const appUser = useAppUser();
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth ${appUser.value ? "private" : "public" } from ${from.path} to ${to.path}`);
  if (to.path == ROUTES.LOGIN) {
    if (appUser.value) {
      return navigateTo(ROUTES.HOME);
    }
    return;
  }
  else if (to.path == ROUTES.RESET) {
    if (appUser.value) {
      return navigateTo(ROUTES.HOME);
    }
    return;
  }
  else if (to.path == ROUTES.LOGOUT) {
    return;
  }
  else if (page && page.public == true) {
    if (appUser.value) {
      return navigateTo(ROUTES.HOME);
    }
    return;
  }
  else if (page && page.public == false) {
    if (appUser.value) {
      return;
    }
    return navigateTo(ROUTES.LOGIN);
  }
  else if (appUser.value) {
    return;
  }
  else {
    return navigateTo(ROUTES.LOGIN);
  }
});