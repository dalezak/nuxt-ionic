<!--
  progress-meter — the suite's one progress bar.

    <progress-meter :value="0.15" label="15%" caption="8 of 55 lessons" />
    <progress-meter :value="0.5" label="2 of 4" />

  Replaces FIVE near-identical implementations that had drifted apart in every
  detail: 4px vs 10px tall, 2px vs 5px vs 999px radius, primary vs success fill,
  0.3s vs 0.4s transition, and the label above the bar in one place and beside it
  in the others. Several appeared on one screen and read as different mechanisms.

  There is deliberately NO size prop. The first version had one ('sm' in cards,
  'md' in headers) and the bars still looked different — the drift had just moved
  from five stylesheets into a single prop. A progress bar means the same thing
  on a card as in a header, so it looks the same in both.

  props:
    value    — 0–1 fraction. Clamped, so a caller that hands over 8/5 or a NaN
               gets a sane bar rather than one overflowing its track.
    label    — short text beside the bar ("15%", "2 of 4"). Keep it to the
               NUMBER: the bar already says "progress", so a label repeating
               "complete" beside it is the same fact twice. Omit for a bare bar.
    caption  — a line beneath ("8 of 55 lessons"), for descriptive copy
               too long to sit inline.
    color    — any Ionic colour name; success by default, because progress here
               means "completed", not "loading".
-->

<template>
  <div class="progress-meter">
    <div class="progress-meter-row">
      <div class="progress-meter-track">
        <div
          class="progress-meter-fill"
          :style="{ width: `${fraction * 100}%`, background: `var(--ion-color-${color})` }" />
      </div>
      <span v-if="label" class="progress-meter-label">{{ label }}</span>
    </div>
    <p v-if="caption" class="progress-meter-caption">{{ caption }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  value: { type: Number, default: 0 },
  label: { type: String, default: null },
  caption: { type: String, default: null },
  color: { type: String, default: 'success' },
});

const fraction = computed(() => {
  const n = Number(props.value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
});
</script>

