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
const { name } = useAppConfig();
const { isRoot } = useAppRoute();
const { isApp, isWeb } = useAppScreen();

const showTabFirst = () => {
  if (isRoot.value) {
    showPageIndex();
  }
}

if (isApp.value) {
  onMounted(() => {
    showTabFirst();
  })
}
else {
  showTabFirst();
}
</script>