<template>
  <ion-card class="filter-bar">
    <ion-grid>
      <ion-row class="ion-align-items-center" :class="(options?.length || label) ? 'ion-justify-content-between' : 'ion-justify-content-end'">
        <ion-col v-if="label && (!options || options.length === 0)" size="auto">
          <ion-label class="filter-label">{{ label }}</ion-label>
        </ion-col>
        <ion-col v-if="options && options.length > 0" size="auto">
          <ion-select
            :model-value="modelValue"
            interface="popover"
            class="filter-select"
            @update:model-value="$emit('update:modelValue', $event)">
            <ion-select-option
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value">
              {{ opt.label }}
            </ion-select-option>
          </ion-select>
        </ion-col>
        <ion-col v-if="placeholder !== undefined" size="auto">
          <ion-searchbar
            :model-value="search"
            :placeholder="placeholder"
            :debounce="debounce"
            show-cancel-button="never"
            class="search-bar"
            @update:model-value="$emit('update:search', $event)">
          </ion-searchbar>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: null },
  search: { type: String, default: '' },
  options: { type: Array, default: null },
  label: { type: String, default: null },
  placeholder: { type: String, default: 'Search...' },
  debounce: { type: Number, default: 200 },
});

defineEmits(['update:modelValue', 'update:search']);
</script>

<style scoped>
.filter-bar {
  margin: 0 0 1rem;
}
.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 0.25rem;
}
.filter-select {
  font-size: 0.9rem;
  --padding-start: 0.25rem;
}
.search-bar {
  --box-shadow: none;
  --background: transparent;
  padding-top: 0;
  padding-bottom: 0;
  max-width: 260px;
}
</style>
