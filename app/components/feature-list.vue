<template>
  <ion-list class="feature-list" lines="none">
    <ion-item v-for="feature in features" :key="feature.title" class="feature-list-item">
      <ion-icon
        :icon="feature.icon"
        :color="feature.color ?? 'primary'"
        slot="start"
        class="feature-list-icon" />
      <ion-label class="ion-text-wrap">
        <h3 class="feature-list-title">{{ feature.title }}</h3>
        <p class="feature-list-description">{{ feature.description }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup>
// Generic feature / benefit list — a column of icon + title + description
// rows. The content (the `features` array) is app-specific; this component
// just renders it consistently so landing/start surfaces look the same across
// apps (love-well, best-self, any-learn, …).
//
// features: [{ icon, color?, title, description }]
//   - icon        — an ionicons import (string under the hood) or icon component
//   - color       — Ionic color name for the icon (default 'primary')
//   - title       — short benefit headline
//   - description — one or two supporting sentences
defineProps({
  features: { type: Array, default: () => [] },
});
</script>

<style lang="scss">
.feature-list {
  background: transparent;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.feature-list-item {
  --background: transparent;
  --padding-start: 0;
  --inner-padding-end: 0;
}

.feature-list-icon {
  font-size: 1.75rem;
  align-self: flex-start;
  margin-top: var(--space-2);
}

.feature-list-title {
  font-size: var(--text-md);
  font-weight: var(--weight-medium);
  margin-bottom: 0.15rem;
}

.feature-list-description {
  font-size: var(--text-sm);
  color: var(--ion-color-medium-shade);
  line-height: var(--leading-normal);
}
</style>
