<template>
  <!-- Quiet grey chip, always visible — never a dismissible banner. The point
       is that it is THERE on every surface where AI has shaped what the user is
       reading, not that they acknowledge it once. -->
  <div class="ai-disclaimer">
    <ion-chip color="medium">
      <ion-icon :icon="informationCircleOutline" />
      <ion-label>{{ resolved }}</ion-label>
    </ion-chip>
  </div>
</template>

<script setup>
import { informationCircleOutline } from 'ionicons/icons';

// The persistent "what this is and isn't" affordance for AI-touched surfaces.
//
// ONE component rather than the chip copy-pasted per page: the wording is an
// ethical commitment, and hand-maintained copies drift. Both suite apps hit the
// same failure independently — the chip reached two or three surfaces and then
// stopped, while the ones that most needed it (a page of AI-extracted patterns
// about you) shipped with nothing saying where the words came from.
//
// The WORDING is per-app, because the commitment is: an app that reads your
// journal owes a different sentence from one that suggests a workout. Apps set
// `aiDisclaimer` in `app.config.ts`; the fallback below is deliberately the
// most cautious reading, so an app that forgets to configure it still says
// something true rather than nothing.

const props = defineProps({
  // Per-surface override, for when a page can be specific about what the AI
  // did *here* while keeping the same shape and the same non-negotiable clause.
  text: { type: String, default: null },
});

const FALLBACK = 'AI-generated. Not a substitute for professional care.';

const resolved = computed(() =>
  props.text ?? useAppConfig().aiDisclaimer ?? FALLBACK,
);
</script>

<style lang="scss">
.ai-disclaimer {
  display: flex;
  justify-content: center;
  padding: 0 0 var(--space-1);
}

.ai-disclaimer ion-chip {
  font-size: var(--text-xs);
}
</style>
