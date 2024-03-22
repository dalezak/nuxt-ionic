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

// const appUser = useAppUser();
const appTabs = useAppTabs();
const { name } = useAppConfig();
const { isApp, isWeb } = usePlatform();
// const appTabs = computed(() => tabs.filter(tab => tab.public == !appUser.value));

if (isApp.value) {
  onMounted(() => {
    showPageIndex();
  })
}
else {
  showPageIndex();
}
</script>