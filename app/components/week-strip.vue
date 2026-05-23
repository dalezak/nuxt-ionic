<template>
  <div class="week-strip" :aria-label="ariaLabel">
    <div
      v-for="(day, i) in days"
      :key="i"
      class="dot"
      :class="{ done: day.done, today: day.isToday }"
      :title="day.label"></div>
  </div>
</template>

<script setup>
// Trailing 7-day completion strip — small dots, leftmost = 6 days ago,
// rightmost = today. Filled = you showed up that day. Today gets a thin
// outline so the user can orient. Deliberately no "X/7" copy; the dots
// tell the truth and the user reads what they want from it.
//
// Generic primitive — takes a pre-computed days array, no app-specific
// assumptions. Use for habit completion, lesson completion, journal-
// entry days, or any 7-day "did it happen?" visualization.

const props = defineProps({
  days: { type: Array, required: true }, // [{ date: Date, done: boolean, isToday?: boolean, label?: string }] * 7
});

const ariaLabel = computed(() => {
  const filled = props.days.filter(d => d.done).length;
  return `Showed up ${filled} of the last 7 days`;
});
</script>

<style scoped>
.week-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0.2rem;
  align-items: center;
}

.dot {
  width: 100%;
  max-width: 0.6rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1.25px solid var(--ion-color-medium);
  background: transparent;
  justify-self: center;
  transition: background 0.15s, border-color 0.15s;
}

.dot.done {
  background: var(--ion-color-primary);
  border-color: var(--ion-color-primary);
}

.dot.today {
  outline: 2px solid var(--ion-color-medium-tint);
  outline-offset: 2px;
}

.dot.today.done {
  outline-color: var(--ion-color-primary-tint);
}
</style>
