<template>
  <ion-select :title="title" :value="selected" interface="popover" @ionChange="onChanged">
    <ion-select-option :value="key" :key="key" v-for="(value, key) in options">{{value}}</ion-select-option>
  </ion-select>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  selected: {
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

function onChanged(event) {
  if (event && event.detail) {
    emits("input", event.detail.value);
  }
}
</script>

<style scoped lang="scss">
</style>