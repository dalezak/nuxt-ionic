export default defineNuxtPlugin(nuxtApp => {
  if (nuxtApp.$ionRouter) {
    consoleLog("plugins/ion-router", "already loaded");  
  }
  else {
    consoleLog("plugins/ion-router", "loaded");
    const ionRouter = useIonRouter();
    nuxtApp.provide('ionRouter', ionRouter);
  }
})