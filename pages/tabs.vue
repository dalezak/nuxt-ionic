<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="appTabs" :visible="isWeb" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="appTabs" :visible="isApp"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue';

definePageMeta({
  alias: ['/']
})

const { path } = useRoute();
const appUser = useAppUser();
const { name, tabs } = useAppConfig();
const { isApp, isWeb } = usePlatform();
const appTabs = computed(() => tabs.filter(tab => tab.public == !appUser.value));

consoleLog("tabs", "setup", appTabs.value);

const showFirstTab = () => {
  if (appTabs.value.length > 0) {
    showPage(appTabs.value[0].path);
  }
}

if (isApp.value) {
  onMounted(() => {
    consoleLog("tabs", "mounted", appTabs.value);
    showFirstTab();
  })
}
else {
  showFirstTab();
}
</script>