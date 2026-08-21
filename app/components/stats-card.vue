<template>
  <section-card
    class="stats-card"
    :tappable="tappable"
    @click="tappable && $emit('click')">
    <div class="stats-card-body">
      <ion-icon v-if="icon" class="stats-card-icon" :icon="icon" :color="color" />
      <!-- Large numbers abbreviate (1234 → "1.2K") via textNumber so the big
           figure never overflows the tile; strings pass through verbatim. -->
      <span class="stats-card-value">{{ textNumber(value) }}</span>
      <span class="stats-card-label">{{ label }}</span>
    </div>
  </section-card>
</template>

<script setup>
// A single stat tile — centered icon / big number / quiet label — for
// at-a-glance dashboards (Growth's body-of-work grid, and any future stat
// surface). Built ON section-card so ALL chrome (background, radius, border,
// shadow, tap affordance) stays token-driven and re-skins with every other
// card; only the inner stat layout lives here.
//
// Tappable tiles are doorways back into the content they count — consumers
// wire `@click` to navigate, keeping the tile a reflection, not a score.
// Grid consumers typically zero the stacking margin + stretch height via a
// class on this component (it lands on the section-card root).
defineProps({
  // The big number (or short string) the tile leads with.
  value: { type: [Number, String], required: true },
  // The quiet label under it (count-only phrasing, e.g. "lessons walked").
  label: { type: String, required: true },
  // Optional leading ionicon + its Ionic color name.
  icon: { type: [String, Object], default: null },
  color: { type: String, default: 'primary' },
  tappable: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

