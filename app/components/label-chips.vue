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
    titlecase — Title-case the label (lowercase slugs like a topic)

  props (apply to every chip; per-item `titlecase` still works for one-offs):
    uppercase  — render every label uppercase (with letter-spacing)
    titlecase — Title-case every label

  Example:
    <label-chips :items="[
      { icon: ioniconsBookOutline, label: `${n} lessons` },
      { icon: ioniconsTimeOutline, label: `${mins} min total` },
      { label: topic, titlecase: true },
    ]" />
-->

<template>
  <div v-if="items?.length" class="label-chips">
    <span
      v-for="(chip, i) in items"
      :key="i"
      class="label-chip"
      :class="{ 'label-chip--uppercase': uppercase, 'label-chip--titlecase': titlecase || chip.titlecase }"
      :style="chipStyle(chip)">
      <span v-if="chip.emoji" class="label-chip-emoji">{{ chip.emoji }}</span>
      <ion-icon v-else-if="chip.icon" :icon="chip.icon" class="label-chip-icon" />
      <span class="label-chip-label">{{ chip.label }}</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  uppercase: { type: Boolean, default: false },
  titlecase: { type: Boolean, default: false },
});

function chipStyle(chip) {
  if (chip.filled && chip.color) return { background: `var(--ion-color-${chip.color})`, color: '#fff' };
  if (chip.color) return { color: `var(--ion-color-${chip.color}-shade)` };
  return null;
}
</script>

<style scoped>
.label-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.label-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  padding: 0.2rem 0.55rem;
  border-radius: 0.6rem;
  background: var(--ion-color-step-50, #f5f5f5);
  color: var(--ion-color-medium-shade);
  white-space: nowrap;
}

.label-chip--uppercase .label-chip-label {
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.label-chip--titlecase .label-chip-label {
  text-transform: capitalize;
}

.label-chip-icon,
.label-chip-emoji {
  font-size: 0.9rem;
  line-height: 1;
}
</style>
