export default defineNuxtRouteMiddleware(async(to, from) => {
  const loggedIn = useLoggedIn();
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth ${loggedIn ? "private" : "public" } from ${from.path} to ${to.path}`);
  if (to.path == '/login') {
    if (loggedIn) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/reset') {
    if (loggedIn) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (page && page.public == true) {
    if (loggedIn) {
      return navigateTo('/');
    }
    return;
  }
  else if (page && page.public == false) {
    if (loggedIn) {
      return;
    }
    return navigateTo('/login');
  }
  else {
    return navigateTo('/login');
  }
});