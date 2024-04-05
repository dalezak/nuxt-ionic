export default defineNuxtPlugin(nuxtApp => {
  const ionRouter = useIonRouter();
  consoleLog("plugins/ion-router", ionRouter);
  nuxtApp.provide('ionRouter', ionRouter);
})