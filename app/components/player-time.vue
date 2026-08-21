<!--
  Player time — the session clock shared by every guided player: a large light
  figure for where you are, a smaller muted one for the whole.

      0:12 / 1:26

  Promoted here after the same rule was hand-copied into three players across
  two layers (breathing + stillness in nuxt-practices, meditation in
  nuxt-meditations) and started drifting: one showed elapsed against total, one
  a bare countdown, and the type sizes had already diverged.

  `total` is optional — a ready screen that only knows how long the sitting will
  be passes `value` alone and gets the same figure without a denominator.

  Seconds in, `m:ss` out. Formatting lives here so three players can't disagree
  about how a duration reads.
-->

<template>
  <p class="player-time">
    {{ format(value) }}<!--
    --><span v-if="total != null" class="player-time-total"> / {{ format(total) }}</span>
  </p>
</template>

<script setup>
defineProps({
  // The figure that carries the weight — elapsed time, or a duration on a
  // ready screen.
  value: { type: Number, required: true },
  // The quiet reference beside it. Null/omitted renders no denominator.
  total: { type: Number, default: null },
});

function format(seconds) {
  const s = Math.max(0, Math.round(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
</script>

