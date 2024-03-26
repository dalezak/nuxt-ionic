export default defineNuxtRouteMiddleware(async(to, from) => {
  const appUser = useAppUser();
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth ${appUser.value ? "private" : "public" } from ${from.path} to ${to.path}`);
  if (to.path == '/login') {
    if (appUser.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/reset') {
    if (appUser.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (page && page.public == true) {
    if (appUser.value) {
      return navigateTo('/');
    }
    return;
  }
  else if (page && page.public == false) {
    if (appUser.value) {
      return;
    }
    return navigateTo('/login');
  }
  else if (appUser.value) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});