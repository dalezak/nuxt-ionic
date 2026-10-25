<!--
  progress-steps — "here's what's happening" for a long piece of work: a
  spinner over a centred column of steps (each circle with its text beneath,
  joined by a connector). For a modal's working state, e.g. a generate flow's
  Writing… → Recording the voice → Opening it.

    <progress-steps :steps="steps" />

  `steps` is <step-timeline>'s shape: [{ id, title, subtitle?, status }]. Set
  each status from what has actually returned — never on a timer — so the
  list is a true account of where things are.
-->

<template>
  <div class="progress-steps">
    <ion-spinner name="dots" />
    <step-timeline class="progress-steps-list" centered :steps="steps" />
  </div>
</template>

<script setup>
defineProps({
  steps: { type: Array, default: () => [] },
});
</script>

<style lang="scss">
.progress-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding-block: var(--space-8);
}

.progress-steps-list {
  width: 100%;
  max-width: 22rem;
}
</style>
