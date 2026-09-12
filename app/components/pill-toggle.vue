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

<style lang="scss">
.pill-toggle {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--ion-color-step-200, #cfcfcf);
  background: transparent;
  color: var(--ion-color-medium-shade);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.pill-toggle--active {
  border-color: var(--pill-accent, var(--ion-color-primary));
  background: rgba(var(--pill-accent-rgb, var(--ion-color-primary-rgb)), 0.12);
  color: var(--pill-accent-shade, var(--ion-color-primary-shade));
}
</style>
