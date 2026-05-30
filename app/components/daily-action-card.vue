<template>
  <section-card
    :accent="accent"
    :icon="icon"
    :icon-color="iconColor"
    :title="title"
    :subtitle="subtitle"
    disclosure
    :to="route"
    @click="$emit('click')" />
</template>

<script setup>
// Generic single-row "daily action" card — tap-to-navigate call-to-action
// with accent stripe, icon, title, subtitle, and a trailing chevron. A
// thin semantic wrapper over section-card so call sites can express
// intent ("this is today's nudge") with sensible defaults (accent="act",
// disclosure always on).
//
// `route` uses section-card's built-in router-link navigation; the
// `click` event still fires so callers can attach analytics or extra
// side effects without taking over navigation.
//
// Usage:
//   <daily-action-card
//     :icon="ioniconsFlashOutline"
//     title="Daily Challenge"
//     subtitle="5 questions across your recent lessons"
//     route="/daily-challenge" />

defineProps({
  icon: { required: true },
  iconColor: { type: String, default: null },
  accent: { type: String, default: 'act' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  route: { type: String, default: null },
});

defineEmits(['click']);
</script>
