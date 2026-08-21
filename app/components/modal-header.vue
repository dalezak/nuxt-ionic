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
});
defineEmits(['close']);
</script>
