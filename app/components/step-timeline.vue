<template>
  <div class="step-timeline" :class="{ 'step-timeline--emphasize': emphasizeCurrent }">
    <div
      v-for="(step, i) in steps"
      :key="step.id ?? i"
      class="step"
      :class="[`step--${statusOf(step)}`, { 'step--static': !isInteractive(step) }]"
      @click="isInteractive(step) && onStepClick(step, i)">
      <div class="step-rail">
        <div class="step-node">
          <ion-icon
            v-if="statusOf(step) === 'completed'"
            :icon="ioniconsCheckmark"
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
        :icon="ioniconsChevronForwardOutline"
        class="step-disclosure"
        :class="{ 'step-disclosure--muted': statusOf(step) !== 'current' }" />
    </div>
  </div>
</template>

<script setup>
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
//   steps:       [{ id, title, subtitle?, status?: 'completed'|'current'|'upcoming', ... }]
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

<style scoped>
.step-timeline {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: 1rem;
  cursor: pointer;
}

/* A header step whose sub-items carry the actions — not itself tappable. */
.step--static {
  cursor: default;
}

.step-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.5rem;
}

.step-node {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.step-line {
  flex: 1;
  width: 2px;
  background: var(--ion-color-light-shade);
  min-height: 1.25rem;
  margin: 0.25rem 0;
}

.step-body {
  flex: 1;
  padding-bottom: 1rem;
}

/* Trailing disclosure chevron — aligned to the title row, accent-tinted to
   echo the current step's color. Pinned to the top so it tracks the title,
   not the vertical center of a tall (subtitled) row. */
.step-disclosure {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.4rem;
  font-size: 1.05rem;
  color: var(--ion-color-primary);
}

/* On a fully-tappable timeline (`disclosure="all"`), non-current chevrons
   are muted so the current step's chevron still reads as the primary CTA. */
.step-disclosure--muted {
  color: var(--ion-color-medium);
  opacity: 0.6;
}

.step-body-default {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--ion-text-color);
}

.step-subtitle {
  font-size: 0.85rem;
  margin: 0;
  color: var(--ion-color-medium);
  line-height: 1.4;
}

.step--completed .step-node {
  background: var(--ion-color-primary);
}

.step--completed .step-node-icon {
  color: white;
  font-size: 1rem;
}

.step--completed .step-line {
  background: var(--ion-color-primary);
}

.step--completed .step-title,
.step--completed .step-subtitle {
  opacity: 0.55;
}

.step--current .step-node {
  background: transparent;
  border: 2px solid var(--ion-color-primary);
}

.step--current .step-title {
  color: var(--ion-color-primary);
}

.step--upcoming .step-node {
  background: transparent;
  border: 2px solid var(--ion-color-light-shade);
}

.step--upcoming .step-title,
.step--upcoming .step-subtitle {
  opacity: 0.5;
}

/* Emphasized current step (opt-in via `emphasizeCurrent`) — marks the one
   "do this now" step as the primary CTA. The tinted panel is drawn as a
   ::before with z-index -1 inside a step-local stacking context, so it sits
   behind the body without shifting the rail or nodes. Left inset clears the
   rail (1.5rem) + gap (1rem) so the tint hugs only the body. */
.step-timeline--emphasize .step--current {
  position: relative;
  z-index: 0;
}

.step-timeline--emphasize .step--current::before {
  content: '';
  position: absolute;
  inset: -0.15rem -0.6rem 0.35rem 2.3rem;
  background: rgba(var(--ion-color-primary-rgb), 0.08);
  border-radius: 0.75rem;
  z-index: -1;
  pointer-events: none;
}

.step-timeline--emphasize .step--current .step-title {
  font-weight: 700;
}

.step-timeline--emphasize .step--current .step-subtitle {
  color: var(--ion-color-primary);
  opacity: 0.85;
}
</style>
