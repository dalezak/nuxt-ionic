<template>
  <ion-refresher @ionRefresh="onRefresh">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</template>

<script setup>
// Pull-to-refresh wrapper. Hide the `event.target.complete()` boilerplate
// that every refresh handler repeated. Pass `:load` as a no-arg async
// function — the component awaits it and completes the refresher (even
// when the load throws).
//
//   <page-refresher slot="fixed" :load="loadData" />
//
// `slot="fixed"` (Ionic positioning inside `<ion-content>`) inherits onto
// the root `<ion-refresher>` via Vue 3's default attribute fall-through.

const props = defineProps({
  load: { type: Function, required: true },
});

async function onRefresh(event) {
  try {
    await props.load();
  } finally {
    event?.target?.complete?.();
  }
}
</script>
