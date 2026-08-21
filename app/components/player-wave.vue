<!--
  Player wave — the one curve every guided player draws.

  Two modes, one implementation:

    PACED (pass `phases`)     a scrolling sine past a fixed marker, each phase
                              labelled where it happens, the stretch to the
                              marker's right being the breath you haven't taken
                              yet. This is an instruction: follow it.

    AMBIENT (no `phases`)     the same curve drifting slowly, with no phase
                              labels and no countdown. This is an anchor: rest
                              on it. It still drifts at a BREATHABLE rate
                              (DRIFT_PERIOD) — it looks identical to the paced
                              curve, so people breathe with it regardless of
                              what it's meant to be, and a rate nobody can
                              follow makes a calm surface stressful.

  It exists as one component because it was briefly two — a canvas inside the
  breathing player and a separate ambient one — and every bug had to be found
  twice. The drift direction was wrong in one and right in the other; the
  measure-before-layout bug was fixed in one and re-introduced in the other. A
  shared visual with props has one place to be wrong.

  Sizing comes from CSS. The canvas matches its own box via ResizeObserver
  rather than measuring at mount, because a canvas inside a modal is measured
  before the modal has finished animating in and comes back zero-width — which
  clamps the bitmap to a pixel and stretches it back across the element.
-->

<template>
  <canvas ref="canvasRef" class="player-wave" aria-hidden="true"></canvas>
</template>

<script setup>
const props = defineProps({
  // ── Paced mode ────────────────────────────────────────────────────────────
  // [{ label, seconds, scale }] — the shape the breathing exercises already
  // carry. `scale` is the circle-era target size; normalising it gives the
  // curve's height, so a "Hold" (which repeats the previous scale) lands as a
  // flat plateau with no extra data.
  phases: { type: Array, default: null },
  // Which phase is running, and when it started (performance.now()). The parent
  // keeps its own scheduler — it owns the haptics and the session clock — and
  // this only draws where that scheduler says we are, re-syncing every turn.
  phaseIndex: { type: Number, default: 0 },
  phaseStartedAt: { type: Number, default: null },
  // False freezes the curve at the start of the pattern: a ready screen shows
  // the SHAPE of the breath it's about to pace, held still. A curve already
  // scrolling before you tap Start reads as a session you've missed the top of.
  running: { type: Boolean, default: false },
  // Seconds of breath visible across the band. ~1.5 cycles reads as a rhythm;
  // many more and the swell compresses into a ripple.
  windowSeconds: { type: Number, default: 16 },
  // Phase names as a standing legend across the top, active one lit. Off for
  // players with no phases to name.
  labels: { type: Boolean, default: true },

  // ── Both modes ────────────────────────────────────────────────────────────
  // The dot on the curve. In paced mode it means "you are here in the breath";
  // in ambient mode there's no breath, so it reads as "you are here in the
  // session" and simply rides the drift.
  marker: { type: Boolean, default: true },
  // Ambient only: freeze the drift in place (a paused sitting). The curve stays
  // visible, it just stops moving.
  paused: { type: Boolean, default: false },
  // Peak height as a fraction of the box.
  amplitude: { type: Number, default: 0.3 },
  // Any CSS color. Defaults to the Ionic tertiary ramp.
  color: { type: String, default: null },
});

const canvasRef = ref(null);
let ctx = null;
let rafId = null;
let resizeObserver = null;
let started = 0;
let frozenAt = 0;

const isPaced = computed(() => Array.isArray(props.phases) && props.phases.length > 0);

// ── Ambient geometry ────────────────────────────────────────────────────────
// A SINGLE sine, not a sum of harmonics. Summing three bought non-repetition at
// the cost of the shape — harmonics distort a sine rather than translate it, so
// crests came out uneven and the two ends of the band sat at different heights.
// Non-repetition comes from two slow drifts instead (phase on one period,
// amplitude on another, sharing no common multiple), which leaves the shape a
// pure sine at every instant. Matched to the paced curve's ~1.6 swells.
const WAVELENGTHS = 1.6;
// Seconds for the curve to travel one full wavelength — which is also the
// marker's rise-and-fall period, so it IS a breath rate whether or not that was
// the intent. It was 23s (11.5s in, 11.5s out) on the theory that ambient meant
// "no period to lock onto, rest on it, don't follow it". People follow it: the
// curve and the riding marker look exactly like the paced breathing player's,
// so a sitting read as an instruction nobody can obey — the first outside
// tester said he could never hold his breath that long, and he was right.
// 10s is 5 in / 5 out — 6 breaths a minute, the slow-breathing coherence range,
// and in step with the 8–10s cycles the breathing exercises are seeded at. Slow
// enough to still read as ambient drift, achievable if someone does breathe
// along.
const DRIFT_PERIOD = 10;
// Amplitude swells on its own, much longer period, so the curve never repeats
// exactly. Kept co-prime-ish with the drift (LCM 370s) — the point is that the
// two cycles don't line up within a sitting.
const SWELL_PERIOD = 37;
const SWELL_DEPTH = 0.22;

// ── Paced geometry ──────────────────────────────────────────────────────────
const BREATHE_MIN_SCALE = 0.45;   // matches nuxt-practices' guided-types
const SPAN = 1 - BREATHE_MIN_SCALE;
const levelOf = (phase) =>
  SPAN <= 0 ? 1 : ((phase?.scale ?? BREATHE_MIN_SCALE) - BREATHE_MIN_SCALE) / SPAN;

// Level entering phase i — the previous phase's resting level, which is what
// makes a hold flat and the first inhale start from empty.
function entryLevel(i) {
  const list = props.phases ?? [];
  if (list.length === 0) return 0;
  return levelOf(list[(i - 1 + list.length) % list.length]);
}

// Sine easing — how a breath actually moves; you can't inhale at constant
// velocity through the turn. Easing at the ends is fine here (unlike on a lone
// scaling circle) because the curve carries direction in its shape, so
// legibility never depends on the marker's instantaneous speed.
const sineLerp = (a, b, p) =>
  a + (b - a) * (1 - Math.cos(Math.PI * Math.min(Math.max(p, 0), 1))) / 2;

// Level at `offset` seconds from now, walking the phase ring either way.
// Negative offsets are breath already taken, positive ones breath still coming.
function pacedAt(offset) {
  const list = props.phases ?? [];
  if (list.length === 0) return { level: 0, phase: null };
  let index = props.phaseIndex % list.length;
  const anchor = props.phaseStartedAt ?? performance.now();
  const gone = props.running ? (performance.now() - anchor) / 1000 : 0;
  let t = gone + offset;

  while (t < 0) {
    index = (index - 1 + list.length) % list.length;
    t += list[index].seconds;
  }
  while (t >= list[index].seconds) {
    t -= list[index].seconds;
    index = (index + 1) % list.length;
  }
  return {
    level: sineLerp(entryLevel(index), levelOf(list[index]), t / list[index].seconds),
    phase: list[index],
  };
}

function sizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return false;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return true;
}

function resolvedColor() {
  if (props.color) return props.color;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-tertiary').trim();
  return value || '#6d5bd0';
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  // A bitmap this small means layout hasn't settled; drawing into it is what
  // stretches a dot across the whole element. Skip — the observer will re-size.
  if (w < 2 || h < 2) return;

  const color = resolvedColor();
  const mutedColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-medium').trim() || '#8b85a0';
  const showLabels = props.labels && isPaced.value;
  const labelBand = showLabels ? 26 : 0;
  const top = labelBand + 10;
  const bottom = h - 10;
  const yFor = (level) => bottom - level * (bottom - top);
  const markerX = w * 0.5;

  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let markerY;

  if (isPaced.value) {
    const secPerPx = props.windowSeconds / w;
    const offsetAt = (px) => (px - markerX) * secPerPx;

    const stroke = (fromPx, toPx, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.beginPath();
      for (let px = fromPx; px <= toPx; px += 2) {
        const y = yFor(pacedAt(offsetAt(px)).level);
        px === fromPx ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
    };

    // Behind the marker solid, ahead of it faint — the horizon.
    stroke(0, markerX, 1);
    stroke(markerX, w, 0.28);

    if (showLabels) {
      // FIXED legend, not travelling with the curve: the wave slides, the words
      // hold still, and the active one brightens as its turn comes round. Two
      // moving things when only one should move reads as drift.
      const names = [];
      for (const phase of props.phases) {
        if (!names.includes(phase.label)) names.push(phase.label);
      }
      const activeLabel = pacedAt(0).phase?.label;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '600 13px ui-sans-serif, system-ui, -apple-system, sans-serif';
      names.forEach((name, i) => {
        const x = w * ((i + 0.5) / names.length);
        const active = props.running && name === activeLabel;
        ctx.globalAlpha = active ? 0.95 : 0.35;
        ctx.fillStyle = active ? color : mutedColor;
        ctx.fillText(name, x, labelBand / 2 + 6);
      });
    }

    markerY = yFor(pacedAt(0).level);
  } else {
    const t = (props.paused ? frozenAt : (performance.now() - started)) / 1000;
    const mid = (top + bottom) / 2;
    const amp = (bottom - top) / 2;
    // Amplitude breathes slowly; the phase travels. `+ drift`, not `-`:
    // sin(kx − ωt) travels RIGHTWARD, which ran the curve opposite to the paced
    // one (where the stretch right of the marker is what arrives next, so the
    // pattern slides left). With a fixed marker, a rightward curve reads as the
    // dot running backwards along it.
    const swell = 1 - SWELL_DEPTH + SWELL_DEPTH * Math.sin((t / SWELL_PERIOD) * Math.PI * 2);
    const drift = (t / DRIFT_PERIOD) * Math.PI * 2;
    const yAt = (x) => mid + Math.sin((x / w) * WAVELENGTHS * Math.PI * 2 + drift) * amp * swell;

    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const y = yAt(x);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    markerY = yAt(markerX);
  }

  if (props.marker) {
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(markerX, markerY, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function frame() {
  draw();
  rafId = requestAnimationFrame(frame);
}

function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

watch(() => props.paused, (paused) => {
  if (paused) frozenAt = performance.now() - started;
  else started = performance.now() - frozenAt;
});

onMounted(() => {
  started = performance.now();
  nextTick(() => {
    sizeCanvas();
    // Paced motion is the instruction itself, so it runs regardless. Ambient
    // drift is decoration: reduced motion gets the curve, held still.
    if (!isPaced.value && prefersReduced()) draw();
    else frame();
  });
  if (typeof ResizeObserver !== 'undefined' && canvasRef.value) {
    resizeObserver = new ResizeObserver(() => { if (sizeCanvas()) draw(); });
    resizeObserver.observe(canvasRef.value);
  }
});

onUnmounted(() => {
  stop();
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = null;
});
</script>

