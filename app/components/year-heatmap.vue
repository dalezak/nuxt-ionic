<template>
  <div class="year-heatmap">
    <div v-if="monthLabels.length > 0" class="month-row" :aria-hidden="true">
      <span class="weekday-spacer"></span>
      <div class="month-labels" :style="`grid-template-columns: repeat(${weekCount}, minmax(0, 1fr))`">
        <span
          v-for="(label, i) in monthLabels"
          :key="i"
          class="month-label"
          :style="`grid-column: ${label.col} / span ${label.span}`">{{ label.text }}</span>
      </div>
    </div>
    <div class="body">
      <div class="weekday-labels" :aria-hidden="true">
        <span v-for="(d, i) in weekdayLabels" :key="i" class="weekday">{{ d }}</span>
      </div>
      <div
        class="grid"
        :style="`grid-template-columns: repeat(${weekCount}, minmax(0, 1fr))`">
        <div
          v-for="(cell, i) in cells"
          :key="i"
          class="cell"
          :class="{
            'cell--in-year': cell.inYear,
            'cell--done': cell.inYear && cell.done,
            'cell--today': cell.isToday,
          }"
          :style="cell.inYear && cell.done && accentColor ? `background: ${accentColor}; border-color: ${accentColor}` : ''"
          :title="cell.label"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// GitHub-style year heatmap. Renders a full calendar year as a 52–53
// column × 7 row grid (weeks across, days down). Cells fill in when at
// least one event lands that day; cells outside the rendered year are
// transparent; today gets a ring.
//
// Generic primitive — takes an array of event-shaped objects (anything
// with a date field), the same shape as `<consistency-grid>`. Use for
// long-haul visualization of any time-keyed activity: reflections,
// lesson completions, journal entries, badge earns.
//
// The "for years not weeks" pattern — even at 6px cell size on mobile,
// the *shape* of the year communicates presence at a glance. Resists
// the optimization-grind framing of compliance % by showing presence
// instead.
//
// Props:
//   events:       [{ created_at }, ...]    — any objects with a date field
//   year:         number (default current) — calendar year to render
//   dateField:    string (default 'created_at') — which field to bucket by
//   startWeekOn:  'sunday' | 'monday'      — first row weekday (default sunday)
//   accentColor:  string (optional)        — hex/css color for filled cells;
//                                            falls back to --ion-color-primary
//   showMonths:   boolean (default true)   — render the month-label row above
//
// Slots: none. Tap action deliberately omitted in v1 — adding listeners
// to 365 cells on mobile is hostile UX. Use a separate "drill into year"
// affordance instead if needed.

const props = defineProps({
  events: { type: Array, default: () => [] },
  year: { type: Number, default: null },
  dateField: { type: String, default: 'created_at' },
  startWeekOn: { type: String, default: 'sunday' },
  accentColor: { type: String, default: null },
  showMonths: { type: Boolean, default: true },
});

const targetYear = computed(() => props.year ?? new Date().getFullYear());

const weekdayLabels = computed(() =>
  props.startWeekOn === 'monday'
    ? ['M', '', 'W', '', 'F', '', 'S']
    : ['S', '', 'T', '', 'T', '', 'S']
);
// Sparse labels — every-other row to avoid visual noise at small cell sizes.

// Iterate every day from the first-day-of-week containing Jan 1 through
// the last-day-of-week containing Dec 31. Spillover cells render
// transparent (out-of-year). Cells fill via `done` when the event set
// includes their date.
const cells = computed(() => {
  const year = targetYear.value;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  yearStart.setHours(0, 0, 0, 0);
  yearEnd.setHours(0, 0, 0, 0);

  // Snap to the first day of yearStart's week.
  const startDow = yearStart.getDay();                            // 0 = Sun
  const offsetToStart = props.startWeekOn === 'monday'
    ? (startDow === 0 ? 6 : startDow - 1)
    : startDow;
  const gridStart = new Date(yearStart);
  gridStart.setDate(yearStart.getDate() - offsetToStart);

  // Snap to the last day of yearEnd's week.
  const endDow = yearEnd.getDay();
  const offsetToEnd = props.startWeekOn === 'monday'
    ? (endDow === 0 ? 0 : 7 - endDow)
    : 6 - endDow;
  const gridEnd = new Date(yearEnd);
  gridEnd.setDate(yearEnd.getDate() + offsetToEnd);

  // Bucket events by yyyy-mm-dd local time. Skip rows whose date is
  // outside the rendered year — keeps the work proportional to the
  // window, not the dataset.
  const doneDays = new Set();
  for (const e of props.events ?? []) {
    const raw = e?.[props.dateField];
    if (!raw) continue;
    const d = new Date(raw);
    if (d.getFullYear() !== year) continue;
    d.setHours(0, 0, 0, 0);
    doneDays.add(d.getTime());
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const out = [];
  for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    const inYear = cellDate >= yearStart && cellDate <= yearEnd;
    const t = cellDate.getTime();
    out.push({
      date: cellDate,
      inYear,
      done: doneDays.has(t),
      isToday: t === todayTime,
      label: cellDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }
  return out;
});

// Number of week-columns rendered (cells.length / 7).
const weekCount = computed(() => Math.ceil(cells.value.length / 7));

// Month labels positioned over the columns. For each month, find the
// first week-column whose first day is in that month and span until the
// next month begins. Edge: months near year-end may span fewer columns.
const monthLabels = computed(() => {
  if (!props.showMonths || cells.value.length === 0) return [];
  const labels = [];
  const total = cells.value.length;
  let currentMonth = null;
  let currentCol = null;
  for (let col = 0; col < weekCount.value; col++) {
    const firstCellIdx = col * 7;
    if (firstCellIdx >= total) break;
    const firstCell = cells.value[firstCellIdx];
    if (!firstCell.inYear) continue;
    const m = firstCell.date.getMonth();
    if (m !== currentMonth) {
      if (currentMonth !== null) {
        labels.push({
          text: monthName(currentMonth),
          col: currentCol + 1, // 1-based for CSS grid
          span: col - currentCol,
        });
      }
      currentMonth = m;
      currentCol = col;
    }
  }
  if (currentMonth !== null) {
    labels.push({
      text: monthName(currentMonth),
      col: currentCol + 1,
      span: weekCount.value - currentCol,
    });
  }
  // Drop labels whose span is too narrow to render readably.
  return labels.filter(l => l.span >= 2);
});

function monthName(monthIdx) {
  return new Date(2000, monthIdx, 1).toLocaleDateString(undefined, { month: 'short' });
}
</script>

