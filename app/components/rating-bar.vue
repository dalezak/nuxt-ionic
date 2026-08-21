<template>
  <div class="rating-bar">
    <div
      v-for="i in max"
      :key="i"
      class="seg"
      :class="{ 'seg--filled': i <= score }"
      :style="i <= score && color ? `background: ${color}; border-color: ${color}` : ''"></div>
  </div>
</template>

<script setup>
// Read-only N-segment rating bar. Filled segments use the optional
// `color` prop (or `--ion-color-primary` by default); empty segments
// are a light outline. Compact "X of N" visualization for list rows
// or summary cards where a numeric label would be too heavy.

defineProps({
  score: { type: Number, default: 0 },     // 1..max, 0 = not rated
  max:   { type: Number, default: 5 },
  color: { type: String, default: null },  // hex, optional — falls back to primary
});
</script>

