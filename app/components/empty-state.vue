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
    <ion-button size="small"
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

