<template>
  <ion-chip
    button
    class="provenance-chip"
    :aria-label="ariaLabel || label"
    @click="onTap">
    <ion-icon :icon="icon || defaultIcon" />
    <ion-label>{{ label }}</ion-label>
  </ion-chip>
</template>

<script setup>
import { bookOutline } from 'ionicons/icons';

// Provenance chip — a small tappable back-link that surfaces "where
// did this thing come from?" Used on rows that were created from
// another row (a habit adopted from a journal entry; an insight
// extracted from a course lesson; a shift attributed to a practice).
//
// Standardized visual + interaction so users learn one affordance and
// recognize provenance across the app — tap goes back to the source.
//
// Distinct from `labeled-chip.vue` (a taxonomy / category pill) — the
// provenance chip is sentence-cased, larger, and always tappable.
//
// Example usage:
//
//   <provenance-chip
//     label="From your reflection on Apr 28"
//     :icon="ioniconsBookOutline"
//     @tap="showEntry(habit.source_entry_id)" />

const props = defineProps({
  // Required — the chip's user-facing copy. Caller controls phrasing
  // ("From your reflection on …", "From the lesson on …", etc.).
  label: { type: String, required: true },
  // Optional icon override. Defaults to a book icon — the most common
  // case is journal/reflection provenance.
  icon: { type: [String, Object], default: null },
  // Optional aria-label; defaults to `label`. Override when the visible
  // label needs context for screen readers ("Open the source reflection
  // from Apr 28").
  ariaLabel: { type: String, default: null },
});

const emit = defineEmits(['tap']);

const defaultIcon = bookOutline;

function onTap() {
  emit('tap');
}
</script>

<style scoped>
.provenance-chip {
  margin: 0.75rem 0 0;
  font-size: 0.8rem;
  --background: var(--ion-color-step-100, #ececec);
  --color: var(--ion-color-medium-shade);
}

.provenance-chip ion-icon {
  font-size: 0.9rem;
}
</style>
