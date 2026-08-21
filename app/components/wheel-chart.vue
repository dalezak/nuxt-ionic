<template>
  <div class="wheel-chart">
    <!-- Square stage: the SVG fills it, and the perimeter icons are HTML
         overlaid on top, positioned as a % of the stage. Icons are kept OUT
         of the SVG on purpose — a scaled viewBox mis-positions foreignObject
         content in WebKit (icons drift to the edges on small screens). -->
    <div class="wheel-stage" :style="{ maxWidth: size + 'px' }">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        overflow="visible"
        class="wheel-svg">

        <!-- Full-area tap targets — one per segment, the whole pie slice out to
             max radius. So a segment is selectable even where its bands are the
             faint "empty" state (an unrated wheel has no strong fill to tap).
             Rendered first, underneath; the banded cells sit on top with
             pointer-events disabled so taps fall through to these. -->
        <path
          v-for="(seg, i) in segments"
          :key="`hit-${seg.key}`"
          :d="wedgePath(i, max)"
          fill="transparent"
          class="tappable"
          @click="$emit('select', seg)"></path>

        <!-- Banded concentric rings: each segment is a column of `max` level
             bands filling outward from the center. Filled bands (level <=
             score) carry the segment color at strong opacity with a gentle
             center→rim ramp; the rest stay faint so the full circle is always
             visible. The radial + angular gaps let the background show through,
             separating bands and spokes without drawn lines (theme-agnostic). -->
        <path
          v-for="cell in bandCells"
          :key="cell.key"
          :d="cell.d"
          :fill="cell.color"
          :fill-opacity="cell.opacity"
          :class="{ band: true, 'band--highlight': cell.highlight }"></path>

        <!-- Text labels for segments without an icon (native SVG text scales
             fine with the viewBox — only foreignObject has the WebKit bug). -->
        <template v-for="(seg, i) in segments" :key="`label-${seg.key}`">
          <text
            v-if="!seg.icon"
            :x="labelX(i)"
            :y="labelY(i)"
            :text-anchor="labelAnchor(i)"
            dominant-baseline="middle"
            class="wheel-label">
            {{ seg.label }}
          </text>
        </template>
      </svg>

      <!-- Perimeter icons — HTML overlay, positioned by % so they scale and
           stay aligned at any size. -->
      <template v-for="(seg, i) in segments" :key="`icon-${seg.key}`">
        <span v-if="seg.icon" class="wheel-icon" :style="iconStyle(i)">
          <ion-icon :icon="seg.icon" :style="{ color: seg.color || 'var(--ion-text-color)' }" />
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Each segment: { key, label, score (0-10 or null), color?, icon? }
  // When `icon` (an ionicons import) is present it renders at the perimeter
  // in place of the text label, tinted to the segment color.
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
// Hub radius — the empty center the bands grow out from.
const innerRadius = computed(() => radius.value * 0.16);

const defaultColor = 'var(--ion-color-primary)';

// Radial gap between bands and angular gap between segments, in px/radians.
// The background shows through them, separating rings + spokes without lines.
const bandGap = computed(() => props.size * 0.007);
const ANG_GAP = 0.045;

// Each segment occupies (2π / N) radians, starting from -π/2 (top) and going clockwise
function angleStart(i) {
  const n = props.segments.length;
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}
function angleEnd(i) {
  return angleStart(i + 1);
}

// Annular-sector path for band `k` (0-indexed from hub) of segment `i`.
function bandPath(i, k) {
  const a0 = angleStart(i) + ANG_GAP / 2;
  const a1 = angleEnd(i) - ANG_GAP / 2;
  const span = radius.value - innerRadius.value;
  const rIn = innerRadius.value + span * (k / props.max) + bandGap.value / 2;
  const rOut = innerRadius.value + span * ((k + 1) / props.max) - bandGap.value / 2;
  const pt = (r, a) => `${(cx.value + Math.cos(a) * r).toFixed(2)} ${(cy.value + Math.sin(a) * r).toFixed(2)}`;
  return `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} `
       + `L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
}

// Flattened list of every band cell (segment × level) with its fill + opacity.
const bandCells = computed(() => {
  const cells = [];
  props.segments.forEach((seg, i) => {
    const score = seg.score ?? 0;
    const color = seg.color || defaultColor;
    const highlighted = props.highlightKeys.includes(seg.key);
    for (let k = 0; k < props.max; k++) {
      const filled = k < score;
      cells.push({
        key: `${seg.key}-${k}`,
        d: bandPath(i, k),
        color,
        // Filled bands: strong, easing slightly as they near the rim.
        // Empty bands: faint, so the full circle stays visible.
        opacity: filled ? +(0.78 - (k / props.max) * 0.22).toFixed(3) : 0.1,
        highlight: filled && highlighted,
      });
    }
  });
  return cells;
});

function labelMidAngle(i) { return (angleStart(i) + angleEnd(i)) / 2; }
function labelX(i)        { return cx.value + Math.cos(labelMidAngle(i)) * labelRadius.value; }
function labelY(i)        { return cy.value + Math.sin(labelMidAngle(i)) * labelRadius.value; }

function labelAnchor(i) {
  const x = Math.cos(labelMidAngle(i));
  if (Math.abs(x) < 0.3) return 'middle';
  return x > 0 ? 'start' : 'end';
}

// Perimeter icon position as a % of the (square) stage — just outside the
// outer band. Percentage-based so it scales and stays aligned at any size
// (unlike foreignObject, which mis-positions under a scaled viewBox on WebKit).
function iconStyle(i) {
  const a = labelMidAngle(i);
  return {
    left: (50 + 41 * Math.cos(a)).toFixed(2) + '%',
    top: (50 + 41 * Math.sin(a)).toFixed(2) + '%',
  };
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

