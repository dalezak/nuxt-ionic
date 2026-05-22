<template>
  <div v-if="loading" class="ion-text-center ion-padding">
    <ion-spinner :name="name" />
  </div>
</template>

<script setup>
// Centered loading spinner — the wrapper pattern that repeats across
// most `<ion-content>` pages while initial data loads. Renders nothing
// when `loading` is false, so it can sit unconditionally in the template.
//
//   <page-loading :loading="state.loading" />
//
// Optional `:name` passes through to `<ion-spinner>` ('dots', 'lines',
// 'crescent', etc.). Omit it to let Ionic pick the mode-appropriate
// default (iOS vs MD).

defineProps({
  loading: { type: Boolean, default: true },
  name:    { type: String, default: undefined },
});
</script>
