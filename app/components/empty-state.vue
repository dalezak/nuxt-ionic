<template>
  <div class="empty-state ion-text-center ion-padding">
    <ion-icon
      :icon="icon"
      :color="color ?? undefined"
      class="empty-icon"
      :class="{ vivid: !!color }">
    </ion-icon>
    <h3>{{ title }}</h3>
    <p v-if="subtitle">{{ subtitle }}</p>
    <ion-button
      v-if="actionLabel"
      expand="block"
      class="empty-action ion-margin-top"
      @click="$emit('action')">
      {{ actionLabel }}
    </ion-button>
  </div>
</template>

<script setup>
// Small empty-state block: icon + heading + optional subtitle. Pass `color`
// to make the icon vivid (full opacity, themed) rather than the default
// dimmed gray — use for full-page empties where the icon is the focal point.
// Pass `actionLabel` to render a CTA button; bind `@action` to handle the
// click (e.g. "Back to Home" → `showPage('/home')`).

defineProps({
  icon: { required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  color: { type: String, default: null },
  actionLabel: { type: String, default: null },
});

defineEmits(['action']);
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
.empty-icon.vivid {
  opacity: 1;
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
.empty-action {
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
