<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding"></ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const usersStore = useUsersStore();

onMounted (async () => {
  consoleLog("logout", "mounted");
  await usersStore.userLogout();
  await showPageIndex();
})
</script>

<style scoped lang="scss">

</style>