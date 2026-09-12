<template>
  <div class="step-timeline" :class="{ 'step-timeline--emphasize': emphasizeCurrent }">
    <div
      v-for="(step, i) in steps"
      :key="step.id ?? i"
      class="step"
      :class="[`step--${statusOf(step)}`, { 'step--static': !isInteractive(step) }]"
      :style="step.color ? {
        '--step-color': `var(--ion-color-${step.color})`,
        '--step-ink': `var(--ion-color-${step.color}-contrast)`,
      } : null"
      @click="isInteractive(step) && onStepClick(step, i)">
      <div class="step-rail">
        <div class="step-node">
          <ion-icon
            v-if="statusOf(step) === 'completed'"
            :icon="checkmark"
            class="step-node-icon" />
        </div>
        <div v-if="i < steps.length - 1" class="step-line" />
      </div>
      <div class="step-body">
        <slot :name="`step-${step.id}`" :step="step" :status="statusOf(step)" :index="i">
          <slot name="step" :step="step" :status="statusOf(step)" :index="i">
            <div class="step-body-default">
              <h3 class="step-title">{{ step.title }}</h3>
              <p v-if="step.subtitle" class="step-subtitle">{{ step.subtitle }}</p>
            </div>
          </slot>
        </slot>
        <!-- Supplementary content under a step's body, keyed by id. Unlike
             `step-{id}` (which REPLACES the body), this APPENDS below the
             default title/subtitle — so the node, emphasis, and disclosure
             stay intact while a caller adds extras (e.g. a sub-list). Empty
             unless the matching slot is provided. -->
        <slot :name="`step-${step.id}-after`" :step="step" :status="statusOf(step)" :index="i" />
      </div>
      <!-- Disclosure affordance — signals "tap to go here". Opt-in via the
           `disclosure` prop: `true` shows it on the current step only; `"all"`
           shows it on every step (when the whole timeline is tappable). Flows
           that aren't tappable stay arrow-free. -->
      <ion-icon
        v-if="disclosureFor(step)"
        :icon="chevronForwardOutline"
        class="step-disclosure"
        :class="{ 'step-disclosure--muted': statusOf(step) !== 'current' }" />
    </div>
  </div>
</template>

<script setup>
import { checkmark, chevronForwardOutline } from 'ionicons/icons';
// Vertical step timeline. Renders a sequence of steps as connected nodes
// down a left-edge rail — completed steps get a filled checkmark, the
// current step gets an open accent ring (and is auto-derived as the
// first non-completed step if not explicitly marked), upcoming steps
// are muted. Communicates progression through a sequence (today's plan,
// daily ritual, onboarding flow) rather than a flat list.
//
// Generic primitive — no opinions about what a step *is*. Pass the
// shape and an explicit status, or let the component derive current/
// upcoming from the first non-completed step.
//
// Props:
//   steps:       [{ id, title, subtitle?, status?: 'completed'|'current'|'upcoming',
//                  color?: Ionic palette name, ... }]
//
// `color` lets a step own its node, rail and title colour instead of the
// timeline's primary. For a timeline whose steps are IDENTITIES rather than
// numbered stages — love-well's Commit / Learn / Practice / Reflect, which the
// week strip also draws — that keeps the two surfaces saying the same thing in
// the same colour. Omit it and the step is primary, exactly as before.
//   disclosure:  show a trailing chevron (default off). `true` → the current
//                step only (the "do this now" affordance); `"all"` → every
//                step, for a fully tappable timeline. Non-current chevrons
//                render muted so the current step still reads as primary.
//   emphasizeCurrent: give the current step primary-CTA weight (default off) —
//                a tinted panel behind its body + a heavier title, so "what
//                do I do now?" is unmistakable.
//
// Slots:
//   step               — default body for every step (override globally)
//   step-{id}          — body override for a specific step (by id; REPLACES
//                        the title/subtitle)
//   step-{id}-after    — supplementary content APPENDED under a specific
//                        step's body, keeping its default title/subtitle,
//                        node, emphasis, and disclosure (e.g. a sub-list)
//
// Events:
//   step-click(step, index) — bubbled when a step row is tapped

const props = defineProps({
  steps: { type: Array, default: () => [] },
  // false | true (current step only) | 'all' (every step)
  disclosure: { type: [Boolean, String], default: false },
  emphasizeCurrent: { type: Boolean, default: false },
});

const emit = defineEmits(['step-click']);

// A step is interactive unless it explicitly opts out (`step.interactive:
// false`). Non-interactive steps get no disclosure chevron and aren't
// clickable — used when a step is a header whose sub-items carry the actions.
function isInteractive(step) {
  return step.interactive !== false;
}

function disclosureFor(step) {
  if (!isInteractive(step)) return false;
  if (props.disclosure === 'all') return true;
  return props.disclosure === true && statusOf(step) === 'current';
}

const derivedCurrentIndex = computed(() => {
  if (props.steps.some(s => s.status === 'current')) return -1;
  return props.steps.findIndex(s => s.status !== 'completed');
});

function statusOf(step) {
  if (step.status) return step.status;
  const idx = props.steps.indexOf(step);
  if (idx === derivedCurrentIndex.value) return 'current';
  if (idx < derivedCurrentIndex.value || derivedCurrentIndex.value === -1) return 'completed';
  return 'upcoming';
}

function onStepClick(step, index) {
  emit('step-click', step, index);
}
</script>

<style lang="scss">
/* Every step carries its own bottom padding (see .step-body), so each one clears
   the step above it — but the FIRST step had nothing above it to clear, and sat
   flush against the card's subtitle. The card body's own top padding isn't
   enough on its own, because a step's title is a heading-weight line rather than
   the body copy that padding was sized for. */
.step-timeline {
  display: flex;
  flex-direction: column;
  margin-top: var(--space-2);
}

.step-timeline .step {
  display: flex;
  gap: var(--space-4);
  cursor: pointer;
}

/* A header step whose sub-items carry the actions — not itself tappable. */
.step-timeline .step--static {
  cursor: default;
}

.step-timeline .step-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.5rem;
}

.step-timeline .step-node {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: var(--space-1);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.step-timeline .step-line {
  flex: 1;
  width: 2px;
  background: var(--ion-color-light-shade);
  min-height: 1.25rem;
  margin: var(--space-1) 0;
}

.step-timeline .step-body {
  flex: 1;
  padding-bottom: var(--space-4);
}

/* Trailing disclosure chevron — aligned to the title row, accent-tinted to
   echo the current step's color. Pinned to the top so it tracks the title,
   not the vertical center of a tall (subtitled) row. */
.step-timeline .step-disclosure {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: var(--space-2);
  font-size: var(--text-md);
  color: var(--step-color, var(--ion-color-primary));
}

/* On a fully-tappable timeline (`disclosure="all"`), non-current chevrons
   are muted so the current step's chevron still reads as the primary CTA. */
.step-timeline .step-disclosure--muted {
  color: var(--ion-color-medium);
  opacity: 0.6;
}

.step-timeline .step-body-default {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.step-timeline .step-title {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  margin: 0;
  color: var(--ion-text-color);
}

.step-timeline .step-subtitle {
  font-size: var(--text-sm);
  margin: 0;
  color: var(--ion-color-medium);
  line-height: var(--leading-tight);
}

.step-timeline .step--completed .step-node {
  background: var(--step-color, var(--ion-color-primary));
}

/* The tick sits ON the node, so its ink has to come from the node's colour —
   white is only legible on a dark one. A palette that ramps through light
   values needs the contrast token or its checkmarks disappear. */
.step-timeline .step--completed .step-node-icon {
  color: var(--step-ink, white);
  font-size: 1rem;
}

.step-timeline .step--completed .step-line {
  background: var(--step-color, var(--ion-color-primary));
}

.step--completed .step-title,
.step-timeline .step--completed .step-subtitle {
  opacity: 0.55;
}

.step-timeline .step--current .step-node {
  background: transparent;
  border: 2px solid var(--step-color, var(--ion-color-primary));
}

.step-timeline .step--current .step-title {
  color: var(--step-color, var(--ion-color-primary));
}

.step-timeline .step--upcoming .step-node {
  background: transparent;
  border: 2px solid var(--ion-color-light-shade);
}

.step--upcoming .step-title,
.step-timeline .step--upcoming .step-subtitle {
  opacity: 0.5;
}

/* Emphasized current step (opt-in via `emphasizeCurrent`) — marks the one
   "do this now" step as the primary CTA. The tinted panel is drawn as a
   ::before with z-index -1 inside a step-local stacking context, so it sits
   behind the body without shifting the rail or nodes. Left inset clears the
   rail (1.5rem) + gap (1rem) so the tint hugs only the body. */
.step-timeline.step-timeline--emphasize .step--current {
  position: relative;
  z-index: 0;
}

.step-timeline.step-timeline--emphasize .step--current::before {
  content: '';
  position: absolute;
  inset: -0.15rem -0.6rem 0.35rem 2.3rem;
  background: rgba(var(--ion-color-primary-rgb), 0.08);
  border-radius: var(--radius-md);
  z-index: -1;
  pointer-events: none;
}

.step-timeline.step-timeline--emphasize .step--current .step-title {
  font-weight: var(--weight-bold);
}

.step-timeline.step-timeline--emphasize .step--current .step-subtitle {
  color: var(--ion-color-primary);
  opacity: 0.85;
}
</style>
