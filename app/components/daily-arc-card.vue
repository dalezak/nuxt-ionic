<!--
  daily-arc-card — a day's ritual as a vertical step timeline inside a
  section-card: what's done, what's next, where you are. Composes two of this
  layer's own primitives (<section-card>, <step-timeline>) and knows nothing
  about which beats a day has — the parent computes `steps` (each with an
  explicit status) and owns the content under each one.

  Lifted from love-well and best-self, which had written it separately and
  identically apart from three details, now props: the card's `accent`, its
  `title` case, and `emphasize-current` on the rail. Each app's four
  `#step-<beat>-after` slots were hardcoded by name; here every named slot the
  parent provides is forwarded to `step-<name>-after`, so an app with different
  beats (or a different number of them) needs no change to this file.

  Slot scope is <step-timeline>'s: { step, status, index }.
-->
<template>
  <section-card
    :accent="accent"
    :icon="trailSignOutline"
    :subtitle="subtitle"
    :title="title">
    <step-timeline
      :steps="steps"
      disclosure="all"
      :emphasize-current="emphasizeCurrent"
      @step-click="(step) => $emit('step-click', step)">
      <template v-for="name in forwarded" :key="name" #[`step-${name}-after`]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </step-timeline>
  </section-card>
</template>

<script setup>
import { trailSignOutline } from 'ionicons/icons';

defineProps({
  /** Resolved steps, each with an explicit status — <step-timeline>'s shape. */
  steps: { type: Array, default: () => [] },
  /** section-card accent (a palette name). */
  accent: { type: String, default: 'learn' },
  title: { type: String, default: "Today's Path" },
  subtitle: { type: String, default: 'Your day, beginning to end' },
  /** Pass through to <step-timeline>: draw the current step larger. */
  emphasizeCurrent: { type: Boolean, default: false },
});
defineEmits(['step-click']);

const slots = useSlots();
// Every named slot the parent gave us becomes that step's `-after` body.
const forwarded = computed(() => Object.keys(slots));
</script>
