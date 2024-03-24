<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-show="visible">
    <ion-fab-button @click="onClick">
      <ion-icon :icon="icon"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "ioniconsAdd"
  },
  visible: {
    type: Boolean,
    default: true
  },
  click: {
    type: Function,
    default: () => {}
  }
});

const emits = defineEmits([
  "click"
]);

const onClick = (event) => {
  emits("click", event.detail.value);
}
</script>

<style scoped lang="scss">

</style>