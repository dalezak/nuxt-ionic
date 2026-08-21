<template>
  <button
    type="button"
    class="pill-toggle"
    :class="{ 'pill-toggle--active': active }"
    :style="accentVars"
    @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
// A single-select "pill" toggle button — rounded, transparent when idle, tinted
// with an accent when active. Duration / type selectors across the suite (the
// generate modal, the relationship-type picker, …) hand-rolled the same
// rounded-pill CSS; this owns it, parameterized by the active-state `color`.
const props = defineProps({
  active: { type: Boolean, default: false },
  // Ionic color name used for the active-state tint (border + bg + text).
  color: { type: String, default: 'primary' },
});
defineEmits(['click']);

// Scoped CSS can't interpolate a runtime color, so feed the accent in as CSS
// custom properties derived from the Ionic color name.
const accentVars = computed(() => ({
  '--pill-accent': `var(--ion-color-${props.color})`,
  '--pill-accent-rgb': `var(--ion-color-${props.color}-rgb)`,
  '--pill-accent-shade': `var(--ion-color-${props.color}-shade)`,
}));
</script>

