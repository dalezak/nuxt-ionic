<template>
  <div v-if="pieces.length" class="confetti-container" aria-hidden="true">
    <div
      v-for="(piece, i) in pieces"
      :key="i"
      class="confetti-piece"
      :style="{
        left: piece.left,
        background: piece.color,
        animationDelay: piece.delay,
        animationDuration: piece.duration,
        width: piece.size,
        height: piece.size,
        borderRadius: piece.round ? '50%' : '2px',
      }">
    </div>
  </div>
</template>

<script setup>
// Confetti shower used on perfect-score / course-complete moments. Pieces
// spawn when `active` flips true (or on mount if it starts true); clear when
// it flips false. Pure presentational, no logic — pages decide the trigger.

// `variant` controls density + timing. `default` is snappy per-quiz; `grand`
// is the slower/bigger shower for course-complete moments.
const props = defineProps({
  active: { type: Boolean, default: false },
  variant: { type: String, default: 'default' }, // 'default' | 'grand'
  colors: {
    type: Array,
    default: () => ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#A560E8', '#FFC800'],
  },
});

const VARIANTS = {
  default: { count: 40, delayMax: 0.6, durationMin: 1.4, durationRange: 0.8, sizeRange: 6 },
  grand:   { count: 60, delayMax: 1.2, durationMin: 2.0, durationRange: 1.2, sizeRange: 8 },
};

const pieces = ref([]);

function spawn() {
  const v = VARIANTS[props.variant] ?? VARIANTS.default;
  pieces.value = Array.from({ length: v.count }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    color: props.colors[i % props.colors.length],
    delay: `${(Math.random() * v.delayMax).toFixed(2)}s`,
    duration: `${(v.durationMin + Math.random() * v.durationRange).toFixed(2)}s`,
    size: `${6 + Math.round(Math.random() * v.sizeRange)}px`,
    round: Math.random() > 0.5,
  }));
}

watch(() => props.active, (active) => {
  if (active) spawn();
  else pieces.value = [];
}, { immediate: true });
</script>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 999;
}
.confetti-piece {
  position: absolute;
  top: -10px;
  animation: confetti-fall linear forwards;
}
@keyframes confetti-fall {
  0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
</style>
