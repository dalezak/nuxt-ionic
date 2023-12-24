<template>
  <ion-page>
    <ion-header v-if="isMobile">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</ion-card-title>
          <ion-card-subtitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content></ion-card-content>
        <ion-button fill="clear" @click="showPageLogout">Logout</ion-button>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const { isMobile, isWeb } = usePlatform();

</script>
