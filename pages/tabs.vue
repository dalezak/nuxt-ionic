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
definePageMeta({
  alias: ['/']
})

const appTabs = useAppTabs();
const { path } = useAppRoute();
const { name } = useAppConfig();
const { isApp, isWeb } = useAppScreen();

if (path === '' || path === '/') {
  showPageIndex();
}
</script>