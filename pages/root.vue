<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="tabs" :visible="isWeb" :user="currentUser"></nav-bar>
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

const { path } = useRoute();
const currentUser = useCurrentUser();
const { tabs } = useAppConfig();
const { isMobile, isWeb } = usePlatform();

function showFirstPage() {
  if (path == "/" && tabs.length > 0) {
    for (let tab of tabs) {
      if (tab.auth == currentUser.value != null) {
        consoleLog("showFirstPage", tab.path);
        showPage(tab.path, false);
        break;
      }
    }
  }
}

onMounted(() => {
  showFirstPage();
})
</script>