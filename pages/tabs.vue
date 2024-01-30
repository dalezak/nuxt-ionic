<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="tabs" :visible="isWeb" :user="currentUser" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="tabs" :visible="isMobile" :user="currentUser"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/']
})

const currentUser = useCurrentUser();
const { name, tabs } = useAppConfig();
const { isMobile, isWeb } = usePlatform();

consoleLog("tabs", currentUser);

onMounted(() => {
  consoleLog("tabs", "mounted", "ionic");
  showPageIndex();
})
</script>