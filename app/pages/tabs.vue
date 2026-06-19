<template>
  <ion-page>
    <ion-header>
      <nav-bar :tabs="appTabs" :visible="isWeb" :title="name"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="appTabs" :visible="isApp"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Redirect a bare ROOT load ('/') to the first tab — in ROUTE MIDDLEWARE, not
// the component. Two hard-won rules from the "blank page at root" bug:
//
// 1. Component lifecycle is the wrong place. A setup-time showPageIndex() ran
//    before the Ionic router could commit (silently dropped); an onMounted one
//    raced Vue Router's still-pending initial '/' navigation, which finalized
//    last and CANCELLED the redirect (middleware logs fired, URL never moved,
//    blank tabs shell). Middleware runs inside the navigation itself, so the
//    redirect is part of settling '/' — it can't be raced or dropped, and on
//    SSR it becomes a server redirect (no blank flash at all).
//
// 2. Guard on the navigation TARGET (`to.path`), never the tab-parent's own
//    path: on a cold load of a deep route (typing /insights directly, or an
//    iOS tab-discard reload) this parent's route momentarily reads '/', which
//    is how an earlier version bounced users off their route onto tab one.
//    Middleware's `to` is the real destination, so deep routes pass through.
//
// First tab = the same auth-filtered pick as useAppTabs (public tabs for
// guests, private for signed-in) — useAuthSession works in middleware on both
// server (Supabase cookie) and client.
definePageMeta({
  alias: ['/'],
  middleware: [
    function rootRedirect(to) {
      if (to.path !== '/' && to.path !== '') return;
      const { tabs } = useAppConfig();
      const { isAuthenticated } = useAuthSession();
      const first = (tabs ?? []).find(tab => tab.public == !isAuthenticated.value);
      if (first?.path) return navigateTo(first.path, { replace: true });
    },
  ],
})

const appTabs = useAppTabs();
const { name } = useAppConfig();
const { isApp, isWeb } = useAppScreen();
</script>