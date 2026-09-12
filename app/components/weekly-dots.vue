<template>
  <div class="weekly-dots" :style="{ '--strip-accent': `var(--ion-color-${color})` }">
    <div
      v-for="(done, i) in week"
      :key="i"
      class="weekly-day"
      :class="{ 'is-today': i === resolvedTodayIndex }">
      <span class="weekly-day-label">{{ LABELS[i] }}</span>
      <span
        class="weekly-day-dot"
        :class="{ 'is-done': done }"
        :style="{ width: `${size}px`, height: `${size}px` }"
        role="img"
        :aria-label="`${FULL_LABELS[i]}: ${done ? 'done' : 'not yet'}`"
        :title="`${FULL_LABELS[i]}: ${done ? 'done' : 'not yet'}`" />
    </div>
  </div>
</template>

<!--
  weekly-dots — 7 Mon-Sun cells, one dot each: did this happen that day?

  A yes-or-no signal and nothing more. One tracked thing, seven days: a habit,
  an action, a practice, a login. Index 0 = Mon, 6 = Sun.

    <weekly-dots :days="weekActivity" />
    <weekly-dots :days="row.weekDots" color="primary" />

  ── WHY THIS ONLY TAKES BOOLEANS ─────────────────────────────────────────────
  It used to accept four shapes — a boolean, a 0..1 fraction, a { done, total }
  pair, and an array of channels — and rendered a completely different MARK for
  the last one (a dot plus concentric rings rather than a single ring). That
  made the call site unreadable: `<weekly-dots :days="x" />` drew one thing or
  another depending on the runtime shape of `x`, which is computed in some other
  file, and the caller had to know a geometry secret the name never told them.

  The multi-channel form now lives in its own component, <weekly-rings>, which
  is the honest name for what it draws. Each component takes exactly one shape,
  so neither has a branch and the call site says which mark you get.

  The fraction forms went with it. Nothing was using them — a partial arc is a
  ring, and a component called "dots" drawing a three-quarters-filled donut was
  the same category confusion in miniature.

  ── ON THE MARK ──────────────────────────────────────────────────────────────
  A filled dot in the strip's colour, or a grey one. Deliberately not a ring
  with a hollow centre: that reads as a container waiting to be filled, which is
  a progress semantic, and this mark has no progress to show. Grey vs coloured
  is a LIGHTNESS difference before it is a hue difference, so it survives colour
  blindness and a greyscale screenshot — and every cell carries its own
  aria-label and tooltip, so colour is never the only carrier.

  `color` is the palette the done-dots take, and the colour today's LABEL is
  picked out in. Defaults to "warning" — it pairs with the flame/streak motif.

  `size` is the dot's diameter in px. The default suits a card footer; a
  denser context can go smaller.

  todayIndex auto-computes from `new Date().getDay()` shifted Mon-first;
  override only for testing or when overriding the "today" anchor.
-->

<script setup>
const props = defineProps({
  // 7 booleans, index 0 = Mon, 6 = Sun. Short arrays pad with false; anything
  // truthy counts as done, so a caller mapping over a Set gets what it expects.
  days: { type: Array, default: () => Array(7).fill(false) },
  // Ionic palette color for a done dot, and for today's label.
  color: { type: String, default: 'warning' },
  // Dot diameter in px.
  size: { type: Number, default: 10 },
  // Override today's index (0..6). Null = auto-compute from clock.
  todayIndex: { type: Number, default: null },
});

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// Spelled out for the screen reader — the visible labels repeat "T" and "S",
// which is fine to look at and useless to listen to.
const FULL_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Always exactly seven cells. A short or over-long array would otherwise shift
// every day left, putting Tuesday's mark under Monday's letter — a wrong answer
// rendered confidently, which is worse than a gap.
const week = computed(() =>
  Array.from({ length: 7 }, (_, i) => !!props.days?.[i]),
);

const resolvedTodayIndex = computed(() => {
  if (props.todayIndex !== null) return props.todayIndex;
  const jsDow = new Date().getDay(); // 0=Sun..6=Sat
  return (jsDow + 6) % 7;            // shift so 0=Mon..6=Sun
});
</script>

<style lang="scss">
.weekly-dots {
  display: flex;
  justify-content: space-between;
  /* Light top/bottom breathing room only — when placed in a card footer the
     footer already supplies the outer gap, so the component keeps its own
     padding minimal to avoid doubling up. */
  padding: var(--space-1) 0;
}
.weekly-dots .weekly-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}
.weekly-dots .weekly-day-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.04em;
  color: var(--ion-color-medium);
  text-transform: uppercase;
}
/* Today is marked by the LABEL, not by an outline on the dot — a ring around a
   dot reads as a second state of the dot itself. Follows `color` rather than a
   hardcoded warning, so a strip drawn in its own palette doesn't get today
   picked out in a colour from somewhere else. */
.weekly-dots .weekly-day.is-today .weekly-day-label {
  color: var(--strip-accent, var(--ion-color-warning-shade));
  font-weight: var(--weight-bold);
}

.weekly-dots .weekly-day-dot {
  display: block;
  border-radius: 50%;
  /* An untouched day. Faint on purpose: most of a week is empty most of the
     time, so the empty state is the strip's background, not its subject. */
  background: var(--ion-color-light-shade);
}
.weekly-dots .weekly-day-dot.is-done {
  background: var(--strip-accent, var(--ion-color-warning));
}
</style>
