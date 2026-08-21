<template>
  <ion-header v-if="isApp" :translucent="translucent">
    <ion-toolbar>
      <!-- Always render the back button and let Ionic's ion-back-button own the
           show/hide: it auto-hides when there's no nav history (a page reached
           as a root tab) and shows when the page was pushed onto a stack. Pass
           `back-href` only as the optional no-history fallback — detail pages
           that should always offer a Back target even on a cold/deep load. Do
           NOT default it on tab pages, or the button would always show. -->
      <ion-buttons slot="start">
        <!-- Never on a tab ROOT: tab-bar/nav-bar taps navigate 'root'+'replace',
             but replace only swaps the TOP history entry — a prior tab's pushed
             sub-page leaves an entry beneath, so ion-back-button's auto stack
             check would show Back on a tab page (Learn → Exercises → tap Today
             = Back to Learn). Tab paths come from the app's `tabs` config, so
             the header enforces the root semantic declaratively. -->
        <ion-back-button v-if="!isTabRoot" :default-href="backHref || undefined"></ion-back-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <slot></slot>
    </ion-toolbar>
    <slot name="sub"></slot>
  </ion-header>
</template>

<script setup>
import { refreshOutline } from 'ionicons/icons';
// Page header for Ionic pages. Renders only on Capacitor (`useAppScreen().isApp`)
// — web pages typically use the nav-bar at the top of the layout instead.
//
//   <app-header title="Profile" back-href="/home" />
//
//   <app-header :title="state.course?.title ?? 'Course'" back-href="/courses">
//     <ion-buttons slot="end">
//       <ion-button @click="onRefresh">
//         <ion-icon slot="icon-only" :icon="refreshOutline" />
//       </ion-button>
//     </ion-buttons>
//   </app-header>
//
// The default slot lands inside `<ion-toolbar>`, after the title. Caller-
// supplied `<ion-buttons>` elements use their own `slot="end"` / `slot="primary"`
// attribute for Ionic positioning — those are HTML attributes Ionic reads,
// distinct from Vue's named-slot system.
//
// `translucent` defaults to true (the iOS-style blur-on-scroll look) since
// it's the dominant pattern. Pass `:translucent="false"` for pages that
// don't pair with `<ion-content :fullscreen>`.

defineProps({
  title: { type: String, default: '' },
  backHref: { type: String, default: null },
  translucent: { type: Boolean, default: true },
});

const { isApp } = useAppScreen();

// Is the current route one of the app's tab roots? Tab paths are declared in
// app.config `tabs` as '/today' etc.; pages live under /tabs/* with the bare
// path as an alias, so match both forms.
const route = useRoute();
const { tabs } = useAppConfig();
const isTabRoot = computed(() =>
  (tabs ?? []).some(t => t.path === route.path || `/tabs${t.path}` === route.path)
);
</script>
