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

<style scoped>
.rating-bar {
  display: flex;
  gap: 0.2rem;
  align-items: center;
}

.seg {
  width: 0.9rem;
  height: 0.45rem;
  border-radius: 0.1rem;
  border: 1px solid var(--ion-color-medium);
  background: transparent;
  transition: background 0.15s, border-color 0.15s;
}

.seg--filled {
  background: var(--ion-color-primary);
  border-color: var(--ion-color-primary);
}
</style>
