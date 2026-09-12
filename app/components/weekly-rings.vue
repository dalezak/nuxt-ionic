<template>
  <div class="weekly-rings" :style="{ '--strip-accent': `var(--ion-color-${color})` }">
    <div
      v-for="(entry, i) in week"
      :key="i"
      class="weekly-day"
      :class="{ 'is-today': i === resolvedTodayIndex }">
      <span class="weekly-day-label">{{ LABELS[i] }}</span>
      <svg
        class="weekly-day-mark"
        :width="size"
        :height="size"
        viewBox="0 0 100 100"
        role="img"
        :aria-label="`${FULL_LABELS[i]}: ${describe(entry)}`">
        <title>{{ FULL_LABELS[i] }}: {{ describe(entry) }}</title>

        <!-- Centre dot — the first channel. A single act with no fraction to
             show, so it gives up its ring and buys the ones around it room. -->
        <circle
          cx="50" cy="50" :r="DOT_R"
          :fill="dot(entry).hairline ? 'none' : dot(entry).stroke"
          :fill-opacity="dot(entry).value >= 1 ? 1 : dot(entry).restOpacity"
          :stroke="dot(entry).hairline ? dot(entry).stroke : 'none'"
          :stroke-width="EMPTY_WIDTH"
          :stroke-opacity="dot(entry).restOpacity" />

        <template v-for="(ch, c) in rings(entry)" :key="c">
          <!-- The unfilled part of a ring. Tinted from the ring's OWN hue while
               the day has something in it — that is what makes several rings
               read as several channels rather than several unrelated marks —
               and neutral grey on a day with nothing in it, where four faint
               colours would advertise a day that hasn't happened. -->
          <circle
            class="weekly-day-track"
            cx="50" cy="50" :r="ch.r"
            :stroke="ch.stroke" :stroke-width="ch.restWidth"
            :stroke-opacity="ch.restOpacity" />
          <circle
            v-if="ch.value > 0"
            class="weekly-day-arc"
            cx="50" cy="50" :r="ch.r"
            :stroke="ch.stroke" :stroke-width="ch.width"
            :stroke-dasharray="`${circumference(ch.r) * ch.value} ${circumference(ch.r)}`"
            transform="rotate(-90 50 50)" />
        </template>
      </svg>
    </div>
  </div>
</template>

<!--
  weekly-rings — 7 Mon-Sun cells, each showing SEVERAL things about that day
  and how far each one got: a centre dot plus concentric rings, innermost
  first. Index 0 = Mon, 6 = Sun.

  Each day is an array of channels, `{ value: 0..1, color }`, where `color` is
  an Ionic palette name ('warning', 'primary', a custom `--ion-color-*`, …):

    <weekly-rings :days="week.map(d => d.channels)" />
    <weekly-rings :days="weekChannels" :size="32" color="beat-dusk" />

  ── WHAT THIS IS FOR, AND WHEN TO USE <weekly-dots> INSTEAD ──────────────────
  A boolean dot answers "did you show up", which flattens a day you touched one
  thing against a day you closed everything. A single ring answers "how much"
  but not "which". Channels answer both — and they encode ORDER as radius, so
  for a host whose day genuinely runs from the middle outward (a morning beat at
  the centre, the evening one at the rim) the growth itself carries meaning that
  a position on a clock face could not.

  That is the whole reason to reach for this. If you have ONE thing per day and
  it either happened or it didn't, use <weekly-dots> — it takes booleans, draws
  a dot, and has no geometry to think about. These were a single component with
  a shape-sniffing branch; splitting them means each takes exactly one data
  shape and the call site says which mark it wants.

  ── ON THE MARK ──────────────────────────────────────────────────────────────
  The first channel becomes the dot on purpose: a beat with nothing to say
  beyond yes-or-no does not need a ring, and its band is the first thing to
  disappear as the cell shrinks. Trading it for a dot keeps the whole mark
  legible about 4px further down.

  A day with nothing in it draws the SAME structure in neutral grey, rather than
  a different mark — so an untouched Tuesday shows the shape it is about to
  take, and the strip reads as seven of one thing.

  SVG rather than conic-gradient, because a conic sweep cannot have rounded
  caps — and the caps are most of what makes a partial arc read as a deliberate
  mark rather than a slice cut out of a pie.

  `color` is the accent today's LABEL is picked out in; the marks themselves
  take their colours from the channels. `size` wants ~24 and up, since every
  channel after the dot takes a band — the four-channel case is sized for 32.

  todayIndex auto-computes from `new Date().getDay()` shifted Mon-first;
  override only for testing or when overriding the "today" anchor.
-->

<script setup>
const props = defineProps({
  // 7 entries, index 0 = Mon, 6 = Sun. Each is an array of
  // `{ value: 0..1, color }` channels, innermost first.
  days: { type: Array, default: () => [] },
  // Ionic palette color for today's label. Channels carry their own.
  color: { type: String, default: 'warning' },
  // Rendered size in px. Sized for the four-channel case at 32.
  size: { type: Number, default: 32 },
  // Override today's index (0..6). Null = auto-compute from clock.
  todayIndex: { type: Number, default: null },
});

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// Spelled out for the screen reader — the visible labels repeat "T" and "S",
// which is fine to look at and useless to listen to.
const FULL_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// viewBox units. The mark scales to whatever `size` says.
//
// These have to CLOSE: the outermost ring's outer edge is
// `DOT_R + n*(RING_WIDTH + RING_GAP) + RING_WIDTH/2` for n rings, and that has
// to land on 50, the box's half-width. The first version did not — three rings
// at width 12 reached 64, so the mark drew 28% larger than the size it declared
// and shouldered its neighbours out of the way. `overflow: visible` hid the
// clipping that would otherwise have made it obvious.
//
// Sized for THREE rings plus the dot, which is the four-channel case:
//   12 + 3×(9 + 3.6) + 9/2 = 49.8
const DOT_R = 12;
const RING_WIDTH = 9;
const RING_GAP = 3.6;
// Light enough that an untouched channel recedes. At 0.2 a day with one beat
// done still read as a full target, because the three empty tracks carried
// almost as much ink as the one filled arc.
const TRACK_OPACITY = 0.14;
// A day with NOTHING in it draws the same rings in neutral grey. Same structure
// as every other day, so an untouched Tuesday reads as the shape it is about to
// take rather than as a different kind of mark — it replaced a dashed circle,
// which was the only day in the strip that didn't show what it was waiting for.
//
// Faint on purpose. At full strength six untouched days out-shouted the one day
// with something in it: most of a week is empty most of the time, so the empty
// state is the strip's background, not its subject.
//
// Drawn as HAIRLINES rather than full bands, which is the bigger lever of the
// two. Lightening the colour alone only went so far, because what pulls the eye
// is the STRUCTURE — four concentric circles is eight edges, repeated six
// times, and a repeating texture reads loud however pale it is. At a third of
// the width it carries roughly a third of the ink while still showing the shape
// the day will take, and a day with anything in it visibly thickens.
const EMPTY_STROKE = 'var(--ion-color-light-shade)';
const EMPTY_OPACITY = 0.7;
const EMPTY_WIDTH = 3;

const circumference = (r) => 2 * Math.PI * r;

// Always exactly seven cells, each a normalized channel array. A short array
// would otherwise shift every day left, putting Tuesday's mark under Monday's
// letter. A day with no channels still draws the empty structure.
const week = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const entry = props.days?.[i];
    return Array.isArray(entry)
      ? entry.map(ch => ({
        value: clamp01(Number(ch?.value)),
        stroke: `var(--ion-color-${ch?.color || props.color})`,
      }))
      : [];
  }),
);

const resolvedTodayIndex = computed(() => {
  if (props.todayIndex !== null) return props.todayIndex;
  const jsDow = new Date().getDay(); // 0=Sun..6=Sat
  return (jsDow + 6) % 7;            // shift so 0=Mon..6=Sun
});

function clamp01(n) {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

const isEmpty = (entry) => entry.every(c => c.value <= 0);

// The stroke + rest-opacity a channel draws with, given whether the day it
// belongs to has anything in it at all.
function styled(entry, ch) {
  return isEmpty(entry)
    ? { ...ch, stroke: EMPTY_STROKE, restOpacity: EMPTY_OPACITY, restWidth: EMPTY_WIDTH, hairline: true }
    : { ...ch, restOpacity: TRACK_OPACITY, restWidth: ch.width, hairline: false };
}

// The innermost channel is the dot. A day the host gave no channels for still
// gets one, so the cell draws the empty structure rather than nothing.
function dot(entry) {
  return styled(entry, entry[0] ?? { value: 0, stroke: `var(--ion-color-${props.color})` });
}

// The rings, outward. Radii are derived so every band is the same thickness
// whatever the channel count.
function rings(entry) {
  return entry.slice(1).map((ch, i) => styled(entry, {
    ...ch,
    r: DOT_R + RING_GAP + RING_WIDTH / 2 + i * (RING_WIDTH + RING_GAP),
    width: RING_WIDTH,
  }));
}

// Screen-reader label and native tooltip. A channel only carries a fraction,
// so this reports completeness rather than raw counts — the host owns the
// denominators.
function describe(entry) {
  if (entry.length === 0 || isEmpty(entry)) return 'nothing yet';
  const done = entry.filter(c => c.value >= 1).length;
  return `${done} of ${entry.length} complete`;
}
</script>

<style lang="scss">
.weekly-rings {
  display: flex;
  justify-content: space-between;
  /* Light top/bottom breathing room only — when placed in a card footer the
     footer already supplies the outer gap, so the component keeps its own
     padding minimal to avoid doubling up. */
  padding: var(--space-1) 0;
}
.weekly-rings .weekly-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}
.weekly-rings .weekly-day-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.04em;
  color: var(--ion-color-medium);
  text-transform: uppercase;
}
/* Today is marked by the LABEL alone. An outline around the mark reads as one
   more concentric ring, which is precisely the wrong signal on a mark already
   made of concentric rings.

   Follows the `color` prop rather than a hardcoded warning: a host whose marks
   are drawn in its own palette should not have today picked out in a colour
   from somewhere else. */
.weekly-rings .weekly-day.is-today .weekly-day-label {
  color: var(--strip-accent, var(--ion-color-warning-shade));
  font-weight: var(--weight-bold);
}

.weekly-rings .weekly-day-mark {
  display: block;
  overflow: visible;
}
.weekly-rings .weekly-day-track,
.weekly-rings .weekly-day-arc {
  fill: none;
  stroke-linecap: round;
}
</style>
