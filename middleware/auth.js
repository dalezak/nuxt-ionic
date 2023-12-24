export default defineNuxtRouteMiddleware(async(to, from) => {
  const currentUser = useCurrentUser();
  console.log(`auth from ${from.path} to ${to.path}`, currentUser.value);
  if (to.path == '/login') {
    if (currentUser.value) {
      return navigateTo('/');
    }
    else {
      return;
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (currentUser.value) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});