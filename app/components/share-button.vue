<template>
  <ion-button fill="clear" :title="title" :class="css" @click="onShare">
    <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
  </ion-button>
</template>

<script setup>
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