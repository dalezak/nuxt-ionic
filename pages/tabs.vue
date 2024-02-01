<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="tabs" :visible="isWeb" :public="isPublic" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="tabs" :visible="isMobile" :public="isPublic"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/']
})

const { path } = useRoute();
const hasCurrent = useHasCurrent();
const isPublic = hasCurrent == false;
const { name, tabs } = useAppConfig();
const { isMobile, isWeb } = usePlatform();

onMounted(() => {
  consoleLog("tabs", "mounted", "ionic");
  if (path == "/" || path == "") {
    showPageIndex();
  }
})
</script>