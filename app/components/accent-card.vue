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

<style scoped>
.accent-card {
  border-radius: 20px;
  overflow: hidden;
}

.accent-card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
}

.accent-card-header ion-icon {
  font-size: 1rem;
  flex-shrink: 0;
  color: white;
}

.accent-card-title {
  flex: 1;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
}

.accent-card-subtitle {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}
</style>
