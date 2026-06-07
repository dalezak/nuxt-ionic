<template>
  <ion-refresher @ionRefresh="onRefresh">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</template>

<script setup>
// Pull-to-refresh wrapper. Hide the `event.target.complete()` boilerplate
// that every refresh handler repeated. The component awaits `:load` and
// completes the refresher (even when the load throws).
//
//   <page-refresher slot="fixed" :load="loadData" />
//
// A pull is an explicit "get me the latest", so `:load` is called with
// `true` — the refresh flag. Pages backed by the cache-first store layer
// thread it through (`loadData(refresh = false)` → `loadItems({ refresh })`)
// so a pull busts the memory + localStorage cache and re-fetches. Pages
// that take no argument are unaffected — the extra `true` is ignored.
//
// `slot="fixed"` (Ionic positioning inside `<ion-content>`) inherits onto
// the root `<ion-refresher>` via Vue 3's default attribute fall-through.

const props = defineProps({
  load: { type: Function, required: true },
});

async function onRefresh(event) {
  try {
    await props.load(true);
  } finally {
    event?.target?.complete?.();
  }
}
</script>
