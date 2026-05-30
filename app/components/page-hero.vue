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
      :icon="ioniconsCompassOutline"
      icon-color="primary"
      title="Become your best self.">
      <p>Start where you are. Walk with us — quietly, patiently — through the long becoming.</p>
    </page-hero>

  Styling lives here so the suite (best-self, love-well, any-learn)
  picks up changes in one place.
-->

<script setup>
defineProps({
  icon: { type: [String, Object], default: null },
  iconColor: { type: String, default: 'primary' },
  title: { type: String, default: null },
});
</script>

<style scoped>
.page-hero {
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
}

.page-hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.page-hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.page-hero-body {
  font-size: 1rem;
  opacity: 0.7;
  max-width: 28rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Trim default <p> margins so consumers can pass `<p>...</p>` without
   the body block jumping vertically. */
.page-hero-body :deep(p) {
  margin: 0;
}
</style>
