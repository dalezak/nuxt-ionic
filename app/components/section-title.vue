<template>
  <h2 class="section-title">
    <slot />
  </h2>
</template>

<!--
  section-title — page-level title / hero heading. Used once per page
  for the primary headline:

    <section-title>{{ greeting }}, {{ firstName }}.</section-title>
    <section-title>{{ course.title }}</section-title>

  Sits ABOVE <section-group> in the hierarchy:

    <section-title>      page hero — once per page
    <section-group>      grouping label — many per page (static, or collapsible)
    <ion-list-header>    list caption — Ionic's built-in

  Slot-driven so consumers can include inline elements (icons, name
  parts, emphasis) without changing the component. Styling lives here
  so the suite (best-self, love-well, any-learn) picks up changes in
  one place.
-->

<style scoped>
.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.5rem 0 0.75rem;
}
</style>
