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
        <!-- When the bar is search-only (no label/select) the searchbar fills
             the row (size=""); when it shares the row with a label/select it
             stays content-width (size="auto") on the right. -->
        <ion-col v-if="placeholder !== undefined" :size="(options?.length || label) ? 'auto' : ''">
          <ion-searchbar
            :model-value="search"
            :placeholder="placeholder"
            :debounce="debounce"
            show-cancel-button="never"
            class="search-bar"
            :class="{ 'search-bar--outline': fill === 'outline', 'search-bar--full': !(options?.length || label) }"
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
  // Searchbar chrome. 'clear' (default) keeps the borderless input that
  // blends into the card; 'outline' draws a 1px ring so the input reads
  // as a distinct field. Done via the searchbar's --box-shadow var so it
  // works in either Ionic mode (ion-searchbar has no `fill` prop itself).
  fill: { type: String, default: 'clear', validator: (v) => ['clear', 'outline'].includes(v) },
});

defineEmits(['update:modelValue', 'update:search']);
</script>

