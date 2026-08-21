<template>
  <section-card
    :accent="accent"
    :icon="icon"
    :icon-color="iconColor"
    :title="title"
    :subtitle="subtitle"
    disclosure
    :to="route"
    :tappable="tappable"
    @click="$emit('click')" />
</template>

<script setup>
import { flashOutline } from 'ionicons/icons';
// Generic single-row "daily action" card — tap-to-navigate call-to-action
// with accent stripe, icon, title, subtitle, and a trailing chevron. A
// thin semantic wrapper over section-card so call sites can express
// intent ("this is today's nudge") with sensible defaults (accent="act",
// disclosure always on).
//
// `route` uses section-card's built-in router-link navigation; the
// `click` event still fires so callers can attach analytics or extra
// side effects without taking over navigation. For an action that opens a
// modal (no navigation), omit `route`, set `tappable`, and handle `@click`.
//
// Usage:
//   <daily-action-card
//     :icon="flashOutline"
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
  // Make the card tappable without navigating — for click-handled actions
  // (e.g. opening a modal) where there's no `route`.
  tappable: { type: Boolean, default: false },
});

defineEmits(['click']);
</script>
