<template>
  <ion-select :title="title" :value="value" interface="popover" @ionChange="onChange">
    <ion-select-option :value="key" :key="key" v-for="(label, key) in options">{{label}}</ion-select-option>
  </ion-select>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  value: {
    type: String,
    default: ""
  },
  options: {
    type: Object,
    default: () => {}
  },
});

const emits = defineEmits([
  "input"
]);

function onChange(event) {
  if (event && event.detail) {
    emits("input", event.detail.value);
  }
}
</script>

<style scoped lang="scss">
</style>