<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding"></ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// Explicit import, not the auto-import. This page is PRERENDERED by
// `nuxt generate`, and an auto-import that fails to inject compiles to a bare
// global — it throws at runtime rather than failing the build, the page setup
// dies, and the failure surfaces somewhere unrelated (here, Pinia's
// `app:rendered` hook reporting `$pinia` undefined). Costs one line to be sure.
import { useAppBadge } from '../composables/use-app-badge';

const usersStore = useUsersStore();
// No `enabled` — logout must clear the badge regardless of the user's setting,
// and regardless of whether this app uses badges at all (it no-ops if not).
const { clearBadge } = useAppBadge();

onMounted (async () => {
  consoleLog("logout", "mounted");
  // Clear BEFORE the session goes: a badge left behind after logout shows the
  // previous user's state on the home screen, and the next person to sign in on
  // this device inherits a number that means nothing to them.
  await clearBadge();
  await usersStore.userLogout();
  await showPageIndex();
})
</script>

<style scoped lang="scss">

</style>