<template>
  <ion-button size="small" fill="clear" :title="title" :class="css" @click="onShare">
    <ion-icon :icon="shareSocialOutline"></ion-icon>
  </ion-button>
</template>

<script setup>
import { shareSocialOutline } from 'ionicons/icons';
const props = defineProps({
  css: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: "Share"
  }
})

const emits = defineEmits([
  "share"
]);

function onShare(event) {
  event.stopPropagation();
  emits("share", event);
}
</script>

<style lang="scss" scoped>

</style>