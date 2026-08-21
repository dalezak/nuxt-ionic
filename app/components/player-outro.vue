<!--
  Player outro — the closing beat every guided player ends on: a glyph, a short
  acknowledgement, a line of context.

      🍃
      You showed up.
      A few breaths of presence — that's the whole practice.

  Six players had hand-rolled this same three-element block with their own
  prefixed classes (breathe-done, still-done, ident-done, prompts-done,
  recite-done, med-done) and near-identical CSS. Only one of them animated in.

  The fade matters more here than anywhere else in a player: the screen it
  replaces was moving — a drifting wave, a paced curve — and cutting straight to
  static text reads as the session being interrupted rather than completed. The
  glyph lands a beat after the words so the eye reaches the sentence first
  instead of catching three things arriving at once.

  Deliberately slower than a UI transition. This is the one moment in a player
  with nothing to do.
-->

<template>
  <div class="player-outro">
    <ion-icon v-if="icon" :icon="icon" class="player-outro-icon" />
    <p class="player-outro-title">{{ title }}</p>
    <p v-if="subtitle" class="player-outro-sub">{{ subtitle }}</p>
    <!-- Anything a player needs beneath the acknowledgement (a stat, a link).
         Fades with the rest. -->
    <slot />
  </div>
</template>

<script setup>
defineProps({
  // Ionicon, e.g. leafOutline. Omitted renders text only.
  icon: { type: [String, Object], default: null },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
});
</script>

