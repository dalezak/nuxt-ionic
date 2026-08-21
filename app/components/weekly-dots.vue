<template>
  <div class="weekly-dots">
    <div
      v-for="(active, i) in days"
      :key="i"
      class="weekly-day"
      :class="{ 'is-today': i === resolvedTodayIndex }">
      <span class="weekly-day-label">{{ LABELS[i] }}</span>
      <span
        class="weekly-day-dot"
        :class="{ active }"
        :style="active ? activeStyle : null"></span>
    </div>
  </div>
</template>

<!--
  weekly-dots — 7 Mon-Sun cells showing whether the user did something
  on each day of the current ISO week. Pure presentational; consumer
  hands in a 7-element boolean array (index 0 = Mon, 6 = Sun) and the
  component renders day-letter labels above filled/empty dots, with
  today's cell outlined.

  Generic across the suite — works for lesson completions (any-learn),
  practice reflections (best-self), or any per-day boolean signal.

  Example:

    <weekly-dots :days="state.weekActivity" />

  Color prop maps to an Ionic palette color for the active fill +
  today outline. Defaults to "warning" (warm orange) — pairs with the
  flame/streak motif most apps use.

  todayIndex auto-computes from `new Date().getDay()` shifted Mon-first;
  override only for testing or when overriding the "today" anchor.
-->

<script setup>
const props = defineProps({
  // 7-element boolean array, index 0 = Mon, 6 = Sun. Each true = the
  // user did the tracked thing on that day this week.
  days: { type: Array, default: () => Array(7).fill(false) },
  // Ionic palette color used for the active dot fill + today outline.
  color: { type: String, default: 'warning' },
  // Override today's index (0..6). Null = auto-compute from clock.
  todayIndex: { type: Number, default: null },
});

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const resolvedTodayIndex = computed(() => {
  if (props.todayIndex !== null) return props.todayIndex;
  const jsDow = new Date().getDay(); // 0=Sun..6=Sat
  return (jsDow + 6) % 7;            // shift so 0=Mon..6=Sun
});

const activeStyle = computed(() => ({
  background: `var(--ion-color-${props.color})`,
  borderColor: `var(--ion-color-${props.color})`,
}));
</script>

