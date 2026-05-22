<template>
  <span class="labeled-chip" :class="{ filled: !!background }" :style="chipStyle" :title="label">
    <span v-if="emoji" class="labeled-chip-emoji">{{ emoji }}</span>
    <ion-icon v-else-if="icon" :icon="icon" class="labeled-chip-icon"></ion-icon>
    <span v-if="!compact" class="labeled-chip-label">{{ label }}</span>
  </span>
</template>

<script setup>
// Compact pill with an emoji (or Ionicon) and a label — used for tagging
// items in dense surfaces (course cards, list rows). Two variants:
//
//   <labeled-chip label="Beginner" emoji="🌱" />
//     → muted look (Ionic light/dark variables); use for taxonomy where
//       the colour isn't meaningful.
//
//   <labeled-chip label="Science" emoji="🔬" background="#1cb0f6" />
//     → coloured look (raw hex + white text); use when the colour itself
//       encodes meaning (category, status).
//
// `compact` hides the label, leaving just the emoji/icon pill — useful on
// scroll rows where horizontal space is tight.

const props = defineProps({
  label:      { type: String, required: true },
  emoji:      { type: String, default: null },
  icon:       { type: [String, Object], default: null },
  background: { type: String, default: null },
  compact:    { type: Boolean, default: false },
});

const chipStyle = computed(() => props.background ? { background: props.background } : null);
</script>

<style scoped>
.labeled-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--ion-color-light);
  color: var(--ion-color-dark);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.2;
  white-space: nowrap;
}
.labeled-chip.filled {
  color: white;
}
.labeled-chip-emoji {
  font-size: 0.9rem;
  line-height: 1;
}
.labeled-chip-icon {
  font-size: 0.9rem;
}
.labeled-chip-label {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
