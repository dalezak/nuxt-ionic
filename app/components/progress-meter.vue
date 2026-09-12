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

<style lang="scss">
.progress-meter-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-meter-track {
  flex: 1;
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--ion-color-light-shade);
  overflow: hidden;
}

.progress-meter-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 0.4s ease;
  /* Hairline floor: without it, 1-of-40 rounds to nothing and a user who has
     genuinely started reads as not started. */
  min-width: 2px;
}

.progress-meter-label {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold, 700);
  color: var(--ion-color-medium);
  text-align: right;
}

/* Two classes, not one. This is a <p>, and progress-meter renders inside cards
   (Today's path, page-header, the course cards) where Ionic's `.card-content-* p`
   — specificity (0,1,1) — outranks a single-class rule and would silently force
   0.875rem with no top margin. See the note in CLAUDE.md. It's the only <p> in
   this layer's components that lands inside a card; the rest (section-lede,
   feature-list, the player captions) render outside one, so a single class is
   safe for them. */
.progress-meter .progress-meter-caption {
  margin: var(--space-1) 0 0;
  font-size: var(--text-sm, 0.85rem);
  color: var(--ion-color-medium);
}
</style>
