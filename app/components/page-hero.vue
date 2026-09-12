<template>
  <div class="page-hero ion-text-center ion-padding">
    <ion-icon
      v-if="icon"
      :icon="icon"
      :color="iconColor"
      class="page-hero-icon" />
    <h1 v-if="title" class="page-hero-title">{{ title }}</h1>
    <div v-if="$slots.default" class="page-hero-body">
      <slot />
    </div>
  </div>
</template>

<!--
  page-hero — large centered headline for landing surfaces and standalone
  marketing-style pages (e.g. unauthed landing, plan picker, onboarding
  intro). Bigger and more decorative than <section-title>; not for
  in-tab page headers.

    <section-title>      modest hero inside a tab page (one per page)
    <page-hero>          landing-page hero (a few per app)

  Optional ionicon above the title; default slot carries the lede/body
  text so consumers can include multiple paragraphs, emphasis, links,
  computed parts, etc.

    <page-hero
      :icon="compassOutline"
      icon-color="primary"
      title="Become your best self.">
      <p>Start where you are. Walk with us — quietly, patiently — through the long becoming.</p>
    </page-hero>

  Styling lives here so the suite (best-self, love-well, any-learn)
  picks up changes in one place.
-->

<script setup>
import { compassOutline } from 'ionicons/icons';
defineProps({
  icon: { type: [String, Object], default: null },
  iconColor: { type: String, default: 'primary' },
  title: { type: String, default: null },
});
</script>

<style lang="scss">
.page-hero {
  padding-top: var(--space-8);
  padding-bottom: var(--space-5);
}

.page-hero-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
  display: inline-block;
}

.page-hero-title {
  font-size: 2rem;
  font-weight: var(--weight-bold);
  margin: 0 0 var(--space-2);
}

.page-hero-body {
  font-size: var(--text-base);
  opacity: 0.7;
  max-width: 28rem;
  margin: 0 auto;
  line-height: var(--leading-normal);
}

/* Trim default <p> margins so consumers can pass `<p>...</p>` without
   the body block jumping vertically. */
.page-hero-body p {
  margin: 0;
}
</style>
