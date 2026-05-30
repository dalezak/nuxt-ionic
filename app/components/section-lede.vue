<template>
  <p class="section-lede">
    <slot />
  </p>
</template>

<!--
  section-lede — the muted intro paragraph that sits under a page heading
  (or just below `<app-header>`) and tells the reader what this page is
  for. Common pattern:

    <app-header title="Journals" />
    <ion-content :fullscreen="true" class="ion-padding">
      <page-content>
        <section-lede>Your thoughts, feelings, insights — growth starts with awareness.</section-lede>
        ...
      </page-content>
    </ion-content>

  Slot-driven so consumers can include inline emphasis, interpolations,
  computed parts. Styling lives here so the suite (best-self, love-well,
  any-learn) picks up changes in one place.
-->

<style scoped>
.section-lede {
  color: var(--ion-color-medium-shade);
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0 0 1.25rem;
}
</style>
