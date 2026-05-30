<template>
  <div class="page-error ion-text-center ion-padding">
    <ion-icon
      v-if="icon"
      :icon="icon"
      :color="iconColor"
      class="page-error-icon" />
    <p class="hint">
      <slot />
    </p>
  </div>
</template>

<!--
  page-error — centered italic-muted placeholder for "we tried to load
  this and couldn't" surfaces. Reactive, not proactive — semantically
  distinct from <EmptyState> which means "nothing here yet."

    <EmptyState>     proactive: nothing exists yet (no friends, no badges)
    <page-error>     reactive:  load attempt failed

  Default slot carries the message; optional ionicon sits above. Body
  text uses the global `.hint` class so styling lives with the rest of
  the typography helpers.

    <page-error v-else>
      Could not load this friend.
    </page-error>

    <page-error v-else :icon="ioniconsAlertCircleOutline">
      Something went wrong. Pull to refresh.
    </page-error>
-->

<script setup>
defineProps({
  icon: { type: [String, Object], default: null },
  iconColor: { type: String, default: 'medium' },
});
</script>

<style scoped>
.page-error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.5;
}
</style>
