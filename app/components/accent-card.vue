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

<style lang="scss">
.accent-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.accent-card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
}

.accent-card-header ion-icon {
  font-size: 1rem;
  flex-shrink: 0;
  color: white;
}

.accent-card-title {
  flex: 1;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
}

.accent-card-subtitle {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}
</style>
