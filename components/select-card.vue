<template>
  <ion-card v-if="options && options.length > 0">
    <ion-card-content class="ion-no-padding ion-padding-horizontal">
      <ion-select :title="title" :value="value" interface="popover" @ionChange="onChange">
        <ion-select-option :value="key" :key="key" v-for="(label, key) in options">{{label}}</ion-select-option>
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
  "change"
]);

function onChange(event) {
  if (event && event.detail) {
    emits("change", event.detail.value);
  }
}
</script>

<style scoped lang="scss">
</style>