<!--
  page-header — a page's primary title block (one per page, h1), so detail
  pages (e.g. a Course detail and a Lesson summary) stay visually consistent:
  same type scale, spacing, italic subtitle, chip row, muted description, and
  progress bar. Sits inside page content — distinct from <app-header>, the
  Ionic nav toolbar.

  Props (all optional except title):
    title       — the h1
    subtitle    — an italic secondary line under the title (e.g. a tagline)
    chips       — [{ label, icon? | emoji? }] → a row of uniform light-grey
                  <ion-chip>s (category, level, duration, …). Each chip may
                  carry an `icon` (ionicon) OR an `emoji` (string).
    description — a muted paragraph below the chips
    progress    — 0–1 fraction; when set, renders a thin progress bar + % label
    cta         — { label, icon?, color?, disabled? } → a full-width primary
                  button at the bottom; emits `cta` on click

  Slot:
    default     — content between the progress bar and the CTA (e.g. a detail
                  caption, or other page-specific content).
-->
<template>
  <div class="page-header">
    <h1 class="page-header-title">{{ title }}</h1>
    <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
    <label-chips v-if="chips.length" :items="chips" class="page-header-chips" />
    <p v-if="description" class="page-header-description">{{ description }}</p>
    <div v-if="progress != null" class="page-header-progress">
      <progress-meter :value="progress" :label="`${Math.round(progress * 100)}%`" />
    </div>
    <slot />
    <ion-button size="small"
      v-if="cta"
      expand="block"
      :color="cta.color || 'primary'"
      :disabled="cta.disabled"
      class="page-header-cta"
      @click="$emit('cta')">
      <ion-icon v-if="cta.icon" :icon="cta.icon" slot="start"></ion-icon>
      {{ cta.label }}
    </ion-button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  // [{ label, icon? | emoji? }] — a row of uniform light-grey ion-chips.
  // `icon` is an ionicon object; `emoji` is a string. No per-chip color.
  chips: { type: Array, default: () => [] },
  // 0–1 fraction; when set, renders a thin progress bar with a derived % label.
  progress: { type: Number, default: null },
  // { label, icon?, color?, disabled? } — a full-width primary CTA button at
  // the bottom of the header; emits `cta` on click. Omit for no button.
  cta: { type: Object, default: null },
});

defineEmits(['cta']);
</script>

