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

