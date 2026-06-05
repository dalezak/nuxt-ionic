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

  Slot content stacks below the title and inherits the welcome's
  horizontal padding so taglines, week-strips, and promise lines align
  with the greeting.

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
  padding: 1rem 1rem 0;
}
</style>
