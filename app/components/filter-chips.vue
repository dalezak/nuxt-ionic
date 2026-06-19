<!--
  filter-chips — a single-select chip filter row (category / type / tag / state
  filters). Owns the layout + spacing + active-state styling in one place, so
  every surface that filters by a small, glanceable set of options reads the
  same and a spacing tweak lands everywhere at once.

  Sibling to <filter-bar> (which is the dropdown-select + searchbar pattern, for
  larger / space-constrained option sets). Use <filter-chips> for a short set
  the user should see at a glance.

    <filter-chips v-model="selected" :options="options" all-label="All" />

  Props:
    modelValue — the selected value (null = nothing / "All")
    options    — [{ value, label, icon? }] or plain strings (normalized to
                 value=label). `icon` (an ionicon) renders before the label.
    allLabel   — when set, prepends a reset chip that selects null
    activeColor / inactiveColor — Ionic color names (defaults primary / medium)

  Toggle: tapping the active chip clears back to null (when an allLabel reset
  exists), so a second tap deselects.
-->
<template>
  <div class="filter-chips" :class="{ 'filter-chips--scroll': scroll }">
    <ion-chip
      v-if="allLabel"
      :outline="modelValue !== null"
      :color="modelValue === null ? activeColor : inactiveColor"
      @click="select(null)">
      <ion-label>{{ allLabel }}</ion-label>
    </ion-chip>
    <ion-chip
      v-for="opt in normalizedOptions"
      :key="opt.value"
      :outline="modelValue !== opt.value"
      :color="modelValue === opt.value ? activeColor : inactiveColor"
      @click="select(opt.value)">
      <ion-icon v-if="opt.icon" :icon="opt.icon" />
      <ion-label>{{ opt.label }}</ion-label>
    </ion-chip>
  </div>
</template>

<script setup>
const props = defineProps({
  // Selected value; null = nothing selected ("All").
  modelValue: { type: [String, Number], default: null },
  // [{ value, label }] objects, or plain strings (normalized below).
  options: { type: Array, default: () => [] },
  // Optional reset chip label; omit to hide the "All" chip.
  allLabel: { type: String, default: null },
  activeColor: { type: String, default: 'primary' },
  inactiveColor: { type: String, default: 'medium' },
  // Layout: wrap to multiple rows (default) vs. a single horizontally-scrolling
  // row (for longer option sets that should stay one line, e.g. type filters).
  scroll: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const normalizedOptions = computed(() =>
  (props.options ?? []).map(o =>
    (o !== null && typeof o === 'object') ? o : { value: o, label: String(o) },
  ),
);

// Toggle semantics: tapping the active chip clears to null when an allLabel
// reset exists (so a second tap deselects); otherwise it just selects.
function select(value) {
  if (value !== null && value === props.modelValue && props.allLabel) {
    emit('update:modelValue', null);
  } else {
    emit('update:modelValue', value);
  }
}
</script>

<style scoped>
/* The flex gap is the single source of spacing — Ionic's default ~4px ion-chip
   margin is zeroed so wrapped rows don't read as too far apart. */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0 0 1rem;
}

/* Single-line, horizontally-scrolling variant for longer option sets. */
.filter-chips--scroll {
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.25rem;
}

.filter-chips--scroll::-webkit-scrollbar {
  display: none;
}

.filter-chips ion-chip {
  margin: 0;
  flex-shrink: 0;
}
</style>
