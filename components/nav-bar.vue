<template>
  <ion-toolbar v-show="visible">
    <ion-title>{{ name || "" }}</ion-title>
    <ion-buttons slot="end">
      <template :key="tab.name" v-for="tab of tabs">
        <ion-button @click="showPage(tab.path, false)" :title="tab.label" v-if="tab.auth == user != null">{{ tab.label }}</ion-button>
      </template>
      <ion-button @click="showPage('/login')" title="Login" v-if="user == null">Login</ion-button>
    </ion-buttons>
  </ion-toolbar>
</template>

<script setup>
const { name } = useAppConfig();

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  tabs: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped lang="scss">

</style>