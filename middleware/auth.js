export default defineNuxtRouteMiddleware(async(to, from) => {
  const user = useCurrentUser();
  consoleLog("auth", currentUser);
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth from ${from.path} to ${to.path}`, user.value ? "private" : "public");
  if (to.path == '/login') {
    if (user.value) {
      return navigateTo('/');
    }
    else {
      return;
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (page && page.public == (user.value == null)) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});