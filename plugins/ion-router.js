export default defineNuxtPlugin(nuxtApp => {
  const ionRouter = useIonRouter();
  consoleLog("plugins/ion-router");
  nuxtApp.provide('ionRouter', ionRouter);
})