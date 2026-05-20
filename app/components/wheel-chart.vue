<template>
  <div class="wheel-chart">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
      overflow="visible"
      class="wheel-svg">

      <!-- Concentric rings as scale guides (1, 5, 10) -->
      <circle
        v-for="ring in rings"
        :key="ring"
        :cx="cx"
        :cy="cy"
        :r="ring * radius / max"
        fill="none"
        stroke="var(--ion-color-medium)"
        stroke-opacity="0.15"
        stroke-width="1"></circle>

      <!-- Wedges, one per segment, filled to the rating value -->
      <path
        v-for="(seg, i) in segments"
        :key="seg.key"
        :d="wedgePath(i, seg.score)"
        :fill="seg.color || defaultColor"
        fill-opacity="0.55"
        stroke="var(--ion-background-color)"
        stroke-width="1.5"
        @click="$emit('select', seg)"
        :class="{ tappable: true, 'wedge--highlight': highlightKeys.includes(seg.key) }"></path>

      <!-- Outer ring (max boundary) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="none"
        stroke="var(--ion-color-medium)"
        stroke-opacity="0.4"
        stroke-width="1.5"></circle>

      <!-- Spokes between segments -->
      <line
        v-for="i in segments.length"
        :key="`spoke-${i}`"
        :x1="cx"
        :y1="cy"
        :x2="spokeX(i - 1)"
        :y2="spokeY(i - 1)"
        stroke="var(--ion-color-medium)"
        stroke-opacity="0.3"
        stroke-width="1"></line>

      <!-- Labels around the perimeter -->
      <text
        v-for="(seg, i) in segments"
        :key="`label-${seg.key}`"
        :x="labelX(i)"
        :y="labelY(i)"
        :text-anchor="labelAnchor(i)"
        dominant-baseline="middle"
        class="wheel-label">
        {{ seg.label }}
      </text>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  // Each segment: { key, label, score (0-10 or null), color? }
  segments: { type: Array, required: true },
  size: { type: Number, default: 320 },
  max: { type: Number, default: 10 },
  // Segment keys to briefly pulse — consumer-driven freshness signal.
  // Useful for "this part of the wheel just changed" feedback (e.g. user
  // completed a practice in pillar X, the X wedge pulses on next view).
  highlightKeys: { type: Array, default: () => [] },
});

defineEmits(['select']);

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
// Reserve ~30% of the half-width for label space. Combined with the
// SVG's overflow="visible" attribute and the container's horizontal
// padding, this lets long labels ("Occupational", "Recreational") render
// fully without clipping at the viewBox edge.
const radius = computed(() => (props.size / 2) * 0.7);
const labelRadius = computed(() => radius.value + 14);

const rings = [props.max / 2, props.max];

const defaultColor = 'var(--ion-color-primary)';

// Each segment occupies (2π / N) radians, starting from -π/2 (top) and going clockwise
function angleStart(i) {
  const n = props.segments.length;
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}
function angleEnd(i) {
  return angleStart(i + 1);
}

function spokeX(i) { return cx.value + Math.cos(angleStart(i)) * radius.value; }
function spokeY(i) { return cy.value + Math.sin(angleStart(i)) * radius.value; }

function labelMidAngle(i) { return (angleStart(i) + angleEnd(i)) / 2; }
function labelX(i)        { return cx.value + Math.cos(labelMidAngle(i)) * labelRadius.value; }
function labelY(i)        { return cy.value + Math.sin(labelMidAngle(i)) * labelRadius.value; }

function labelAnchor(i) {
  const x = Math.cos(labelMidAngle(i));
  if (Math.abs(x) < 0.3) return 'middle';
  return x > 0 ? 'start' : 'end';
}

// Wedge path: a pie slice from center, filled to (score/max) * radius
function wedgePath(i, score) {
  const r = ((score ?? 0) / props.max) * radius.value;
  if (r <= 0) return '';
  const a1 = angleStart(i);
  const a2 = angleEnd(i);
  const x1 = cx.value + Math.cos(a1) * r;
  const y1 = cy.value + Math.sin(a1) * r;
  const x2 = cx.value + Math.cos(a2) * r;
  const y2 = cy.value + Math.sin(a2) * r;
  const largeArc = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${cx.value} ${cy.value} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
</script>

<style scoped>
.wheel-chart {
  display: flex;
  justify-content: center;
  padding: 1rem 3rem; /* horizontal pad so overflow="visible" labels have room */
  overflow: visible;
}

.wheel-svg {
  max-width: 100%;
  height: auto;
  overflow: visible;
}

.wheel-label {
  font-size: 11px;
  font-weight: 500;
  fill: var(--ion-text-color);
}

.tappable {
  cursor: pointer;
  transition: fill-opacity 0.15s;
}

.tappable:hover {
  fill-opacity: 0.75;
}

/* Highlight pulse — fires once per render for segments named in
   highlightKeys. Lifts opacity briefly so the wedge "breathes" once. */
@keyframes wedge-pulse {
  0%   { fill-opacity: 0.55; }
  40%  { fill-opacity: 0.95; }
  100% { fill-opacity: 0.55; }
}

.wedge--highlight {
  animation: wedge-pulse 1.4s ease-in-out 1;
}
</style>
