<!--
  quick-actions-fab — the "do something right now" launcher.

  The tabs answer "where do I go"; this answers "what can I do from here",
  for the unscheduled impulse rather than the day's plan. Several of these
  actions may ALSO appear elsewhere on the page as planned items; that is not
  a duplication to fix — one list is what you committed to, this is what you
  need now, and the same action can legitimately arrive either way.

  Actions are `[{ label, onClick }]`, rendered in the order given. An entry
  whose action is currently impossible should be OMITTED rather than disabled:
  an option that opens nothing is worse than no option, and its absence is
  itself a signal about the state of the day.

    <quick-actions-fab
      title="Right Now"
      subtitle="Something to do, unscheduled."
      :actions="quickActions" />

  A FAB opening an ACTION SHEET rather than an ion-fab-list: fab-list renders
  icon-only mini buttons, and an unlabelled circle is a guess. The sheet is
  also the vocabulary this app already speaks for a short menu of choices
  (regulate-now, the daypart picker), and it costs the same two taps.
-->

<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="quick-fab">
    <ion-fab-button :aria-label="ariaLabel" @click="onOpen">
      <ion-icon :icon="arrowRedoOutline" />
    </ion-fab-button>
  </ion-fab>
</template>

<script setup>
import { arrowRedoOutline } from 'ionicons/icons';

const props = defineProps({
  // [{ label, onClick }] — label is what the sheet shows, onClick runs on pick.
  // Order matters: the sheet renders them as given.
  actions: { type: Array, default: () => [] },
  title: { type: String, default: 'Quick actions' },
  subtitle: { type: String, default: null },
  ariaLabel: { type: String, default: 'Quick actions' },
});

async function onOpen() {
  const list = (props.actions ?? []).filter(a => a?.label && a?.onClick);
  if (!list.length) return;
  const choice = await showActionSheet({
    title: props.title,
    subtitle: props.subtitle ?? undefined,
    actions: list.map(a => a.label),
    cancel: true,
  });
  // Matched by label because that is what the sheet returns. Labels must be
  // unique within one menu — two identical entries would run the first.
  await list.find(a => a.label === choice)?.onClick?.();
}
</script>

<style scoped>
/* Clear of the tab bar, which the FAB would otherwise sit on top of. */
.quick-fab {
  margin-bottom: var(--space-4);
}
</style>
