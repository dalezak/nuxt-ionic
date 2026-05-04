<template>
  <div class="empty-state ion-text-center ion-padding">
    <ion-icon :icon="icon" class="empty-icon"></ion-icon>
    <h3>{{ title }}</h3>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
// EmptyState — simple "no items here" surface for lists.
// Pass an Ionic icon (auto-imported `ioniconsXxx` constants), a title,
// and an optional subtitle.

defineProps({
  icon: { required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
});
</script>

<style scoped>
.empty-state {
  padding-top: 4rem;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.empty-state p {
  opacity: 0.6;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}
</style>
