<template>
  <ion-tabs v-if="tabs && tabs.length > 0">
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar :slot="position" v-show="visible">
      <template :key="tab.name" v-for="tab of tabs">
        <ion-tab-button :tab="tab.name" :href="tab.path" v-if="tab.auth == user != null">
          <ion-icon :icon="getIcon(tab.icon)" />
          <ion-label>{{ tab.label }}</ion-label>
        </ion-tab-button>
      </template>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import * as icon from 'ionicons/icons';
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
function getIcon(name) {
  return icon[name];
}
</script>

<style scoped lang="scss">

</style>