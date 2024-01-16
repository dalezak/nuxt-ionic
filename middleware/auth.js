export default defineNuxtRouteMiddleware(async(to, from) => {
  const user = useCurrentUser();
  consoleLog(`auth from ${from.path} to ${to.path}`, user.value);
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
  else if (user.value) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});