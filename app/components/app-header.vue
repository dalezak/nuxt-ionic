<template>
  <ion-header v-if="isApp" :translucent="translucent">
    <ion-toolbar>
      <ion-buttons v-if="backHref" slot="start">
        <ion-back-button :default-href="backHref"></ion-back-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <slot></slot>
    </ion-toolbar>
    <slot name="sub"></slot>
  </ion-header>
</template>

<script setup>
// Page header for Ionic pages. Renders only on Capacitor (`useAppScreen().isApp`)
// — web pages typically use the nav-bar at the top of the layout instead.
//
//   <app-header title="Profile" back-href="/home" />
//
//   <app-header :title="state.course?.title ?? 'Course'" back-href="/courses">
//     <ion-buttons slot="end">
//       <ion-button @click="onRefresh">
//         <ion-icon slot="icon-only" :icon="ioniconsRefreshOutline" />
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
</script>
