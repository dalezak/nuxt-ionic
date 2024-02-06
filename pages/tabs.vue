<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="appTabs" :visible="isWeb" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="appTabs" :visible="isMobile"></tab-bar>
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
const { isMobile, isWeb } = usePlatform();
const appTabs = computed(() => tabs.filter(tab => tab.public == !appUser.value));

consoleLog("tabs", "setup", appTabs.value);

onMounted(() => {
  consoleLog("tabs", "mounted", appTabs.value);
  if (path == "/" || path == "") {
    showPageIndex();
  }
})
</script>