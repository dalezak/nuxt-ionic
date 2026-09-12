<!--
  step-dots — position in a short, discrete sequence.

    <step-dots :total="6" :current="index" @go="i => index = i" />

  Dots, not a bar. A filling bar reads as task completion; dots read as steps in
  a sequence — the quieter signal, which is what a contemplative surface wants.
  Use dots for a small known count (up to ~8) and a <progress-meter> beyond that,
  where dots stop being countable at a glance.

  Tappable by default: on a self-paced practice, jumping back to statement two is
  a reasonable thing to want. Pass `:navigable="false"` where the sequence must
  be walked in order.
-->

<template>
  <div class="step-dots" :class="{ 'step-dots--static': !navigable }">
    <button
      v-for="i in total"
      :key="i"
      type="button"
      class="step-dots-dot"
      :class="{ 'step-dots-dot--active': i - 1 === current }"
      :disabled="!navigable"
      :aria-label="`Go to ${i} of ${total}`"
      :aria-current="i - 1 === current ? 'step' : undefined"
      @click="navigable && $emit('go', i - 1)"></button>
  </div>
</template>

<script setup>
defineProps({
  total: { type: Number, required: true },
  // Zero-based, matching the index the callers already track.
  current: { type: Number, default: 0 },
  navigable: { type: Boolean, default: true },
});

defineEmits(['go']);
</script>

<style lang="scss">
.step-dots {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin: 0;
}

.step-dots-dot {
  width: 7px;
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--ion-color-step-250, #c8c8c8);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.step-dots--static .step-dots-dot {
  cursor: default;
}

/* Scaled as well as tinted: on a dense row the colour alone is easy to miss,
   and the size change survives a theme that flattens the palette. */
.step-dots-dot--active {
  background: var(--ion-color-tertiary);
  transform: scale(1.35);
}
</style>
