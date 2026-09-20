<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <!-- Default is a text dismiss button ("Close"/"Done"); override via the
             `end` slot for a custom control (e.g. an icon-only close). -->
        <slot name="end">
          <ion-button size="small" @click="$emit('close')">{{ closeLabel }}</ion-button>
        </slot>
      </ion-buttons>
    </ion-toolbar>
    <!-- Flush against the toolbar's underside, which is where a nav bar's
         progress belongs — inside <ion-header> and after the toolbar is the
         placement Ionic styles for it, so it needs no CSS of its own and
         adapts per platform. -->
    <ion-progress-bar
      v-if="progress != null"
      :value="progress"
      :color="progressColor" />
  </ion-header>
</template>

<script setup>
// The shared modal header bar — a title + a trailing dismiss control. Every
// modal in the suite hand-rolled the same ion-header/ion-toolbar/ion-title +
// ion-buttons scaffold; this owns it in one place. Modals keep their own
// ion-content + ion-footer (those vary too much to share).
defineProps({
  title: { type: String, default: '' },
  // Text on the default dismiss button. Ignored when the `end` slot is used.
  closeLabel: { type: String, default: 'Close' },
  // 0-1 fraction; when set, a thin bar rides the bottom edge of the bar.
  // Named to match <page-header>'s `progress`, which takes the same 0-1
  // fraction, so the two headers read the same way from a caller.
  //
  // No label: a nav bar has no room for one, and the surface that needs the
  // numbers should say them in its own content rather than crowd the title.
  progress: { type: Number, default: null },
  // Any Ionic colour. Stays `primary` unless a caller has a reason — a bar
  // that changes colour is making a claim about urgency.
  progressColor: { type: String, default: 'primary' },
});
defineEmits(['close']);
</script>
