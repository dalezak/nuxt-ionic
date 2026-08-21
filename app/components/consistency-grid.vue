<template>
  <div class="consistency-grid" :class="`is-${orientation}`">
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
        :style="levelStyle(cell)"
        :title="cell.title"></div>
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
//   orientation: 'calendar' | 'heatmap'  — 'calendar' (default) stacks weeks
//                downward as 7 day-columns; 'heatmap' runs weeks LEFT→RIGHT as
//                columns with 7 day-rows (the GitHub-contributions band). Use
//                'heatmap' for a compact activity view of a trailing window.
//   maxLevel:    number (default 4)      — intensity buckets. A day's cell
//                shades darker with more events (GitHub-style): 1 event = the
//                lightest tint, `maxLevel`+ events = full accent. maxLevel=1
//                gives the old binary done/not-done look.
//   accentColor: string (optional)       — hex/CSS color the shades ramp toward;
//                falls back to --ion-color-primary.

const props = defineProps({
  events: { type: Array, default: () => [] },
  days: { type: Number, default: 30 },
  startWeekOn: { type: String, default: 'sunday' },
  orientation: { type: String, default: 'calendar' },
  maxLevel: { type: Number, default: 4 },
  accentColor: { type: String, default: null },
});

// Graded fill for a day: mix the accent toward the empty-cell color by how
// many events landed (level 1 → lightest, maxLevel → full accent). Empty days
// keep the flat "in-range" background from CSS.
function levelStyle(cell) {
  if (!cell.inRange || cell.level <= 0) return null;
  const accent = props.accentColor || 'var(--ion-color-primary)';
  const pct = Math.round(30 + (cell.level / props.maxLevel) * 70); // 30%..100%
  const col = `color-mix(in srgb, ${accent} ${pct}%, var(--ion-color-light))`;
  return { background: col, borderColor: col };
}

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

  // Bucket events by yyyy-mm-dd, counting how many landed each day.
  const counts = new Map();
  for (const e of props.events ?? []) {
    if (!e?.created_at) continue;
    // parseTimestamp — created_at is offset-less from a `timestamp without
    // time zone` column; `new Date()` reads it as local and buckets evening
    // events into the wrong square.
    const d = parseTimestamp(e.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const out = [];
  const todayTime = today.getTime();
  for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    const inRange = cellDate >= windowStart && cellDate <= today;
    const t = cellDate.getTime();
    const count = counts.get(t) ?? 0;
    const label = cellDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    out.push({
      date: cellDate,
      inRange,
      done: count > 0,
      count,
      level: count === 0 ? 0 : Math.min(props.maxLevel, count),
      isToday: t === todayTime,
      label,
      title: count > 0 ? `${label} · ${count}` : label,
    });
  }
  return out;
});
</script>

