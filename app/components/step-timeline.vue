<template>
  <div class="step-timeline">
    <div
      v-for="(step, i) in steps"
      :key="step.id ?? i"
      class="step"
      :class="`step--${statusOf(step)}`"
      @click="onStepClick(step, i)">
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
      </div>
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
//   steps:  [{ id, title, subtitle?, status?: 'completed'|'current'|'upcoming', ... }]
//
// Slots:
//   step               — default body for every step (override globally)
//   step-{id}          — body override for a specific step (by id)
//
// Events:
//   step-click(step, index) — bubbled when a step row is tapped

const props = defineProps({
  steps: { type: Array, default: () => [] },
});

const emit = defineEmits(['step-click']);

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
</style>
