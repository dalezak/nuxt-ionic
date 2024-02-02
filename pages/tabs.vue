<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="tabs" :visible="isWeb" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="tabs" :visible="isMobile"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/']
})

const tabs = useAppTabs();
const { path } = useRoute();
const { name } = useAppConfig();
const { isMobile, isWeb } = usePlatform();

consoleLog("tabs", "setup", "ionic");

onMounted(() => {
  consoleLog("tabs", "mounted", "ionic");
  if (path == "/" || path == "") {
    showPageIndex();
  }
})
</script>