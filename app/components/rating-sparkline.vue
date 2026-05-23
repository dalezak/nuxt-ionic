<template>
  <div class="rating-sparkline">
    <div
      v-for="(score, i) in scores"
      :key="i"
      class="col"
      :class="{ 'col--current': i === scores.length - 1 }"
      :title="`${score}/${max}`">
      <div
        v-for="cell in max"
        :key="cell"
        class="cell"
        :class="{ 'cell--filled': cell <= score }"
        :style="cellStyle(cell, score)"></div>
    </div>
    <div
      v-for="i in padCount"
      :key="`pad-${i}`"
      class="col col--empty"
      :aria-hidden="true">
      <div v-for="cell in max" :key="cell" class="cell"></div>
    </div>
  </div>
</template>

<script setup>
// Discrete-block sparkline. Each rating entry is a column of `max` cells
// stacked bottom-up; cells 1..score are filled in `color` (default
// primary), the rest are faint outlines. Reads as a tiny vertical bar
// chart where you can literally count the blocks — no eyeballing
// height-vs-gridline. Empty trailing columns keep widths stable across
// rows with different history lengths.

const props = defineProps({
  scores:   { type: Array,  default: () => [] }, // [3, 3, 4, 4, 5] — oldest to newest
  max:      { type: Number, default: 5 },
  capacity: { type: Number, default: 12 },
  color:    { type: String, default: null },     // hex; falls back to primary
});

const padCount = computed(() => Math.max(0, props.capacity - props.scores.length));

function cellStyle(cell, score) {
  if (cell > score) return '';
  const bg = props.color || 'var(--ion-color-primary)';
  return `background: ${bg}; border-color: ${bg};`;
}
</script>

<style scoped>
.rating-sparkline {
  display: flex;
  align-items: flex-end;
  gap: 0.18rem;
  height: 2rem;
}

.col {
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column-reverse; /* fill from the bottom */
  gap: 1px;
  opacity: 0.75;
  transition: opacity 0.15s;
}

.col--current {
  opacity: 1;
}

.col--empty {
  opacity: 0.4;
}

.cell {
  flex: 1 1 0;
  min-height: 0;
  border-radius: 1px;
  border: 1px solid var(--ion-color-medium);
  background: transparent;
  opacity: 0.5;
}

.cell--filled {
  opacity: 1;
}
</style>
