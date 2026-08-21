<template>
  <ion-card class="accent-card">
    <ion-card-header class="accent-card-header" :style="`background: var(--ion-color-${color})`">
      <ion-icon v-if="icon" :icon="icon"></ion-icon>
      <span class="accent-card-title">{{ title }}</span>
      <slot name="header-end">
        <span v-if="subtitle" class="accent-card-subtitle">{{ subtitle }}</span>
      </slot>
    </ion-card-header>
    <slot></slot>
  </ion-card>
</template>

<script setup>
defineProps({
  icon:     { default: null },
  color:    { type: String, default: 'primary' },
  title:    { type: String, required: true },
  subtitle: { type: String, default: null },
});
</script>

