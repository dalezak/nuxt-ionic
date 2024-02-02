export default defineNuxtRouteMiddleware(async(to, from) => {
  const loggedIn = useLoggedIn();
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth ${loggedIn.value ? "private" : "public" } from ${from.path} to ${to.path}`);
  if (to.path == '/login') {
    if (loggedIn.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/reset') {
    if (loggedIn.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (page && page.public == true) {
    if (loggedIn.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (page && page.public == false) {
    if (loggedIn.value) {
      return;
    }
    return navigateTo('/login');
  }
  else {
    return navigateTo('/login');
  }
});