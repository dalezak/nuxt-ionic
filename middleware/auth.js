export default defineNuxtRouteMiddleware(async(to, from) => {
  const user = await useCurrentUser();
  consoleLog("auth user", user);
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  const isPublic = user == null;
  consoleLog(`auth from ${from.path} to ${to.path}`, isPublic ? "public" : "private");
  if (to.path == '/login') {
    if (isPublic == false) {
      return navigateTo('/');
    }
    else {
      return;
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (page && page.public == isPublic) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});