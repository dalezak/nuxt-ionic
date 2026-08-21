<template>
  <div class="completion-hero">
    <ion-icon class="completion-hero-icon" :icon="icon" />
    <h2 class="completion-hero-title">{{ title }}</h2>
    <div v-if="$slots.default" class="completion-hero-body"><slot /></div>
  </div>
</template>

<script setup>
import { checkmarkCircleOutline } from 'ionicons/icons';
// A quiet completion hero — a centered success checkmark + title + integration
// copy. The suite's "you took time, the work continues" close, shared by the
// course-arrival card, the lesson celebration step, and the practice-complete
// modal. No XP / streak / confetti (per CLAUDE.md). Body goes in the default
// slot; override `icon` for a non-completion use.
defineProps({
  title: { type: String, required: true },
  icon: { type: [String, Object], default: () => checkmarkCircleOutline },
});
</script>

