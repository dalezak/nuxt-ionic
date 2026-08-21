<template>
  <div class="rating-scale" :class="{ 'rating-scale--single': onlySelected }">
    <button
      v-for="n in shownValues"
      :key="n"
      type="button"
      class="pill"
      :class="[`pill--${n}`, { active: modelValue === n, 'pill--readonly': isReadonly }]"
      :style="ratingColor(n) ? { '--pill-color': ratingColor(n) } : undefined"
      :disabled="isReadonly"
      :aria-label="ariaFor(n)"
      @click="isReadonly || $emit('update:modelValue', n)">
      <span class="pill-num">{{ n }}</span>
      <span v-if="labels && labels[n - 1]" class="pill-label">{{ labels[n - 1] }}</span>
    </button>
  </div>
</template>

<script setup>
// Shared 1..N rating scale — colored-circle pills on a red→green gradient
// (1 = red … 5 = green), with an optional word label under each pill. Emits the
// picked value via update:modelValue (v-model compatible). Extracted so every
// rating surface reads the same: rate-modal (nuxt-ratings) + checkin-modal
// (nuxt-checkins) both render this. Default is a 5-point scale; pass `labels`
// (length = max) for a worded scale (Rarely…Always), omit for a bare numeric
// scale that carries its meaning in surrounding anchors.

const props = defineProps({
  // Selected value 1..max (null = unset).
  modelValue: { type: Number, default: null },
  // Number of pills — the scale is 1..max. Gradient colors defined for 1..5.
  max: { type: Number, default: 5 },
  // Optional per-pill labels (length = max). When present, a word renders under
  // each circle; otherwise pills show the number only.
  labels: { type: Array, default: null },
  // Display-only: renders the same scale with the value marked, but inert —
  // for surfaces that REFLECT a rating back rather than collect one (love-well's
  // onboarding shows the capacity you just rated as the reason its practices
  // are on screen). A read-only scale beats a bespoke badge: the user reads the
  // same control they just used, and there's one place the pill visual lives.
  readonly: { type: Boolean, default: false },
  // Render ONLY the picked pill, not the whole scale — for reporting a rating
  // in a line of copy ("you rated this a 1") where the other four would be
  // noise. Implies read-only: a scale with one option isn't a choice. Renders
  // nothing when there's no value to show.
  onlySelected: { type: Boolean, default: false },
});

// 1..max, or just the picked one.
const shownValues = computed(() => {
  const all = Array.from({ length: props.max }, (_, i) => i + 1);
  if (!props.onlySelected) return all;
  return all.filter(n => n === props.modelValue);
});

// onlySelected implies inert — nothing to pick from a scale of one.
const isReadonly = computed(() => props.readonly || props.onlySelected);

defineEmits(['update:modelValue']);

function ariaFor(n) {
  const label = props.labels?.[n - 1];
  const base = label ? `${label} (${n} of ${props.max})` : `${n} of ${props.max}`;
  // Read-only pills aren't choices, so don't announce them as pickable — say
  // which one is the answer.
  if (!isReadonly.value) return base;
  return props.modelValue === n ? `Rated ${base}` : base;
}
</script>

