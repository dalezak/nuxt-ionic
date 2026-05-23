<template>
  <div class="consistency-grid">
    <div class="weekday-labels" :aria-hidden="true">
      <span v-for="(d, i) in weekdayLabels" :key="i" class="weekday">{{ d }}</span>
    </div>
    <div class="grid">
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="cell"
        :class="{
          'cell--in-range': cell.inRange,
          'cell--done': cell.inRange && cell.done,
          'cell--today': cell.isToday,
        }"
        :title="cell.label"></div>
    </div>
  </div>
</template>

<script setup>
// Calendar-style consistency grid. Renders the trailing N days as full
// calendar weeks (7-day rows). Cells outside the window are faded;
// cells within fill in when at least one event lands that day. Today
// gets a ring. No counts shown — the grid speaks.
//
// Generic primitive — takes an array of event-shaped objects (anything
// with a `created_at` field) and buckets them by day. Use for habit
// reflections, lesson completions, journal entries, badge earns, or
// any time-keyed activity.
//
// Props:
//   events:      [{ created_at }, ...]   — any objects with a date field
//   days:        number (default 30)     — how many days back to highlight
//   startWeekOn: 'sunday' | 'monday'     — first column day (default sunday)

const props = defineProps({
  events: { type: Array, default: () => [] },
  days: { type: Number, default: 30 },
  startWeekOn: { type: String, default: 'sunday' },
});

const weekdayLabels = computed(() =>
  props.startWeekOn === 'monday'
    ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
);

const cells = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Window start: today - (days - 1).
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - (props.days - 1));

  // Snap to the first day of its week.
  const startDow = windowStart.getDay();                         // 0=Sun
  const offsetToStart = props.startWeekOn === 'monday'
    ? (startDow === 0 ? 6 : startDow - 1)
    : startDow;
  const gridStart = new Date(windowStart);
  gridStart.setDate(windowStart.getDate() - offsetToStart);

  // Snap end to the last day of today's week.
  const endDow = today.getDay();
  const offsetToEnd = props.startWeekOn === 'monday'
    ? (endDow === 0 ? 0 : 7 - endDow)
    : 6 - endDow;
  const gridEnd = new Date(today);
  gridEnd.setDate(today.getDate() + offsetToEnd);

  // Bucket events by yyyy-mm-dd.
  const doneDays = new Set();
  for (const e of props.events ?? []) {
    if (!e?.created_at) continue;
    const d = new Date(e.created_at);
    d.setHours(0, 0, 0, 0);
    doneDays.add(d.getTime());
  }

  const out = [];
  const todayTime = today.getTime();
  for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    const inRange = cellDate >= windowStart && cellDate <= today;
    const t = cellDate.getTime();
    out.push({
      date: cellDate,
      inRange,
      done: doneDays.has(t),
      isToday: t === todayTime,
      label: cellDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }
  return out;
});
</script>

<style scoped>
.consistency-grid {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.weekday-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  padding: 0 0.1rem;
}

.weekday {
  font-size: 0.65rem;
  color: var(--ion-color-medium);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.cell {
  aspect-ratio: 1 / 1;
  border-radius: 0.2rem;
  background: transparent;
  border: 1px solid transparent;
}

.cell--in-range {
  background: var(--ion-color-light);
  border-color: var(--ion-color-light-shade);
}

.cell--in-range.cell--done {
  background: var(--ion-color-primary);
  border-color: var(--ion-color-primary);
}

.cell--today {
  outline: 1.5px solid var(--ion-color-medium-tint);
  outline-offset: 1px;
}

.cell--today.cell--done {
  outline-color: var(--ion-color-primary-tint);
}
</style>
