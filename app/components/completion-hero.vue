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

<style lang="scss">
.completion-hero {
  text-align: center;
  padding-top: var(--space-5);
}

.completion-hero-icon {
  font-size: 4rem;
  color: var(--ion-color-success);
}

.completion-hero-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  margin: var(--space-3) 0;
  color: var(--ion-text-color);
}

.completion-hero-body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--ion-color-medium-shade);
  margin: 0 auto;
  max-width: 30rem;
}
</style>
