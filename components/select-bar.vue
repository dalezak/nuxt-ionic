<template>
  <ion-select :value="value" interface="popover" @ionChange="onChanged">
    <ion-select-option :value="_value" :key="'value-'+_value" v-for="(_value, index) in getValues">
      {{getLabel(index)}}
    </ion-select-option>
  </ion-select>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  labels: {
    type: String,
    default: ""
  },
  values: {
    type: String,
    default: ""
  }
});

const emits = defineEmits([
  "input"
]);

const getValues = computed(() => {
  return props.values ? props.values.split(",") : [];
});

const getLabels = computed(() => {
  return props.labels ? props.labels.split(",") : [];
});

function getValue(index) {
  let values = getValues.value;
  return values && values.length > index ? values[index] : "";
}

function getLabel(index) {
  let labels = getLabels.value;
  return labels && labels.length > index ? labels[index] : getValue(index);
}

function onChanged(event) {
  if (event && event.detail) {
    emits("input", event.detail.value);
  }
}
</script>

<style scoped lang="scss">
</style>