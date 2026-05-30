<template>
  <h3 class="section-heading">
    <slot />
  </h3>
</template>

<!--
  section-heading — small-caps muted sub-heading used to label a
  grouping within a page (e.g. "Morning", "Night", "Tomorrow" on a
  daily-ritual surface; "Anniversary", "Recent" on history views).

  Sits BELOW <section-title> in the hierarchy:

    <section-title>      page hero — once per page
    <section-heading>    grouping label — many per page
    <ion-list-header>    list caption — Ionic's built-in

  Eyebrow-style — quiet uppercase letterspaced label that groups what's
  directly below it without competing for attention. Pairs naturally
  with <section-card> below it: the heading names the group, the cards
  carry the content.

  Slot-driven so consumers can include inline elements (icons, counts,
  emphasis) without changing the component:

    <section-heading>Tomorrow</section-heading>
    <section-heading>{{ group.label }}</section-heading>
    <section-heading v-if="hasAnniversary">Anniversary</section-heading>

  Styling lives here so the suite (best-self, love-well, any-learn)
  picks up changes in one place.
-->

<style scoped>
.section-heading {
  margin: 1.5rem 0 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ion-color-medium);
}
</style>
