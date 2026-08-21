<!--
  label-chips — the suite's one labeled-pill row. A collection component like
  filter-chips / suggestion-chips: pass `items`, it renders the wrapped row of
  pills. Replaces the per-surface ad-hoc classes that were all the same look
  (.course-meta-chip / .meta-chip / .practice-row-tag / .lesson-card-chip / the
  old labeled-chip / …) so pills read consistently everywhere.

  Default look: muted, sentence-case grey pill with an optional leading
  icon/emoji. Opt into UPPERCASE (taxonomy / status emphasis) via the
  `uppercase` prop. Per-chip options tune individual pills.

  items: [{ label, icon?, emoji?, color?, filled?, titlecase? }]
    label      — the pill text (required)
    icon       — an ionicon shown before the label
    emoji      — an emoji string before the label (icon wins if both)
    color      — an Ionic color name ('primary', 'success', …). Tints the
                 text/icon; with `filled`, becomes a solid background.
    filled     — color background + white text (status/emphasis)
    titlecase  — Title-case the label via textTitle (acronyms like NVC / IFS
                 keep their capitalisation; the DOM text really changes, so
                 screen readers and copy-paste get the cased string)

  props (apply to every chip; per-item `titlecase` still works for one-offs):
    uppercase  — render every label uppercase (with letter-spacing)
    titlecase  — Title-case every label (same textTitle treatment)

  Example:
    <label-chips :items="[
      { icon: bookOutline, label: `${n} lessons` },
      { icon: timeOutline, label: `${mins} min total` },
      { label: topic, titlecase: true },
    ]" />
-->

<template>
  <div v-if="items?.length" class="label-chips">
    <span
      v-for="(chip, i) in items"
      :key="i"
      class="label-chip"
      :class="{ 'label-chip--uppercase': uppercase }"
      :style="chipStyle(chip)">
      <span v-if="chip.emoji" class="label-chip-emoji">{{ chip.emoji }}</span>
      <ion-icon v-else-if="chip.icon" :icon="chip.icon" class="label-chip-icon" />
      <span class="label-chip-label">{{ chipLabel(chip) }}</span>
    </span>
  </div>
</template>

<script setup>
import { bookOutline, timeOutline } from 'ionicons/icons';
const props = defineProps({
  items: { type: Array, default: () => [] },
  uppercase: { type: Boolean, default: false },
  titlecase: { type: Boolean, default: false },
});

// Title-casing runs in JS via textTitle, NOT CSS `text-transform: capitalize`.
// Two reasons the CSS version was wrong:
//   1. It capitalizes every word's first letter but lowercases nothing, so
//      acronyms rendered as "Nvc" / "Ifs" / "Cbt". textTitle leaves an
//      all-uppercase word (length > 1) alone, so NVC / IFS / CBT survive.
//   2. text-transform only changes the PAINTED glyphs — the DOM text stayed
//      the raw lowercase slug, so screen readers and copy-paste got that.
// `uppercase` stays in CSS: it needs the paired letter-spacing, and there's no
// acronym subtlety to preserve there.
function chipLabel(chip) {
  const label = chip.label ?? '';
  return (props.titlecase || chip.titlecase) ? textTitle(label) : label;
}

function chipStyle(chip) {
  if (chip.filled && chip.color) return { background: `var(--ion-color-${chip.color})`, color: '#fff' };
  if (chip.color) return { color: `var(--ion-color-${chip.color}-shade)` };
  return null;
}
</script>

