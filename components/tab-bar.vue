<template>
  <ion-tabs v-if="tabs && tabs.length > 0">
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar :slot="position" v-show="visible">
      <ion-tab-button :tab="tab.name" :href="tab.path" :key="tab.name" v-for="tab of authTabs">
        <ion-icon :icon="getIcon(tab.icon)" v-if="tab.icon" />
        <ion-label v-if="tab.label">{{ tab.label }}</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: true
  },
  tabs: {
    type: Array,
    default: () => []
  },
  position: {
    type: String,
    default: "bottom"
  }
});
const authTabs = computed(() => props.tabs.filter(tab => tab.auth == (props.user != null)));
</script>

<style scoped lang="scss">

</style>