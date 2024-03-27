<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-show="visible">
    <ion-fab-button @click="onClick">
      <ion-icon :icon="getIcon(icon)" v-if="icon"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "add"
  },
  visible: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits([
  "click"
]);

function onClick(event) {
  emits("click", event);
}
</script>

<style scoped lang="scss">

</style>