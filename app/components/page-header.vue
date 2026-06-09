<!--
  page-header — a page's primary title + description block (one per page, h1),
  so detail pages (e.g. a Course detail and a Lesson summary) stay visually
  consistent: same type scale, spacing, and muted description. Sits inside
  page content — distinct from <app-header>, which is the Ionic nav toolbar.
  Page-specific extras go in slots:
    #meta    — a line directly under the title (e.g. duration, "Paired with …")
    default  — anything after the description (e.g. a progress bar + % text)
-->
<template>
  <div class="page-header">
    <h1 class="page-header-title">{{ title }}</h1>
    <slot name="meta" />
    <p v-if="description" class="page-header-description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}
.page-header-title {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.5rem;
}
.page-header-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ion-color-medium-shade);
  margin: 0;
}
</style>
