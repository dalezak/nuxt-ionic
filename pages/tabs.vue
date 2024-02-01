<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="tabs" :visible="isWeb" :user="user" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="tabs" :visible="isMobile" :user="user"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/']
})

const { path } = useRoute();
const user = useCurrentUser();
const { name, tabs } = useAppConfig();
const { isMobile, isWeb } = usePlatform();

onMounted(() => {
  consoleLog("tabs", "mounted", "ionic");
  if (path == "/" || path == "") {
    showPageIndex();
  }
})
</script>