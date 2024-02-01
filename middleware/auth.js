export default defineNuxtRouteMiddleware(async(to, from) => {
  const hasCurrent = useHasCurrent();
  const isPublic = hasCurrent == false;
  const { tabs } = useAppConfig();
  const page = tabs.find(tab => tab.path == to.path);
  consoleLog(`auth from ${from.path} to ${to.path}`, isPublic ? "public" : "private");
  if (to.path == '/login') {
    if (hasCurrent) {
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