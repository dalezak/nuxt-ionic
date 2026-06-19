<template>
  <div class="page-welcome">
    <section-title>{{ greeting }}, {{ firstName }}{{ suffix }}</section-title>
    <slot />
  </div>
</template>

<!--
  page-welcome — personal opener at the top of a tab page. Renders the
  time-of-day greeting + first name as a section-title, with a default
  slot for whatever the app wants below (tagline, week-strip, dots,
  promise lines, etc.).

  Caller wires the greeting + first name via the layer's useGreeting()
  composable. Suffix lets each app pick its own tone:

    any-learn: " 👋"  → "Good afternoon, Dale 👋"
    best-self: "."    → "Good afternoon, Dale."
    love-well: "."    → "Good afternoon, Dale."

  Slot content stacks below the title and shares the welcome's box, so
  taglines, week-strips, and promise lines align with the greeting — and,
  because the welcome adds no horizontal padding of its own, with every
  other surface at the page container's content edge (cards, section
  headings). Horizontal spacing is owned by the page container, never by
  this component (same rule as cards — see card-tokens.css).

  Example:

    <page-welcome :greeting="greeting" :first-name="firstName" suffix=" 👋">
      <section-lede>{{ tagline }}</section-lede>
    </page-welcome>
-->

<script setup>
defineProps({
  greeting:  { type: String, default: '' },
  firstName: { type: String, default: '' },
  suffix:    { type: String, default: '' },
});
</script>

<style scoped>
.page-welcome {
  /* Top spacing only — horizontal padding is the page container's job, so the
     greeting + slot (tagline, week-strip) align with cards and section
     headings at the content edge instead of being inset an extra 1rem. */
  padding: 1rem 0 0;
}
</style>
