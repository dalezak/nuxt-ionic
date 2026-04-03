import masonry from 'vue-next-masonry';
export default defineNuxtPlugin(nuxtApp => {
  if (nuxtApp.$masonry) {
    consoleLog("plugins/masonry", "already loaded");
  }
  else {
    consoleLog("plugins/masonry", "loaded");
    nuxtApp.vueApp.use(masonry);
  }
})