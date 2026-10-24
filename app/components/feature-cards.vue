<template>
  <div class="feature-cards">
    <section-card
      v-for="feature in features"
      :key="feature.title"
      :icon="feature.icon"
      :icon-color="feature.color ?? 'primary'"
      :title="feature.title">
      <p class="feature-cards-description">{{ feature.description }}</p>
    </section-card>
  </div>
</template>

<script setup>
// Feature / benefit cards — the same `features` array as <feature-list>, drawn
// as section-cards instead of list rows, so a landing page looks like the app
// behind it (every in-app surface is built from section-card). Swap one for the
// other with no change to the data:
//
//   <feature-cards :features="features" />   // cards
//   <feature-list  :features="features" />   // compact rows
//
// features: [{ icon, color?, title, description }]
//   - icon        — an ionicons import
//   - color       — Ionic color name for the icon (default 'primary')
//   - title       — short benefit headline
//   - description — one or two supporting sentences
defineProps({
  features: { type: Array, default: () => [] },
});
</script>

<style lang="scss">
.feature-cards {
  margin-bottom: var(--space-4);
}

.feature-cards-description {
  margin: 0;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--ion-color-medium-shade);
}
</style>
