<template>
  <ion-card v-if="options && options.length > 0">
    <ion-card-content class="ion-no-padding ion-padding-horizontal">
      <ion-select :title="title" :value="selected" interface="popover" @ionChange="onChange">
        <ion-select-option :value="value" :key="value" v-for="(label, value) in options">{{label}}</ion-select-option>
      </ion-select>
    </ion-card-content>
  </ion-card>
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

function onChange(event) {
  if (event && event.detail) {
    emits("input", event.detail.value);
  }
}
</script>

<style scoped lang="scss">
</style>