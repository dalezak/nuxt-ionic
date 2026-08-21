<!--
  suggestion-chips — a presentational cloud of tappable suggestion chips with a
  "more ideas" refresh button. Stateless: the parent owns the list and wires
  @select (a chip was tapped) + @refresh to its own behavior — e.g. open a
  create flow, set a topic field, or v-model a value.

  Sibling to <filter-chips> (single-select filter row): use <filter-chips> to
  filter a set, <suggestion-chips> to offer a set of pickable ideas the user
  acts on, with a refresh to shuffle in more.

    <suggestion-chips :suggestions="ideas" :selected="topic" @select="onPick" @refresh="onMore" />

  Props:
    suggestions  — array of label strings
    selected     — highlights the chip matching this value (e.g. current pick)
    refreshLabel — refresh-button text (default "More ideas")
    center       — center the chips (card surfaces) vs left-align (form surfaces)

  Emits: select (the tapped suggestion), refresh.
-->
<template>
  <div class="suggestion-chips">
    <div class="suggestion-chips-list" :class="{ 'suggestion-chips-list--center': center }">
      <ion-chip
        v-for="s in suggestions"
        :key="s"
        :color="selected === s ? 'primary' : undefined"
        @click="$emit('select', s)">
        {{ s }}
      </ion-chip>
    </div>
    <ion-button fill="clear" size="small" expand="block" class="suggestion-chips-refresh" @click="$emit('refresh')">
      <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
      {{ refreshLabel }}
    </ion-button>
  </div>
</template>

<script setup>
import { refreshOutline } from 'ionicons/icons';
defineProps({
  // Array of label strings to render as chips.
  suggestions: { type: Array, default: () => [] },
  // Highlights the chip matching this value (e.g. the currently chosen topic).
  selected: { type: String, default: null },
  // Refresh button label — "More ideas" (default) / "Refresh List" / etc.
  refreshLabel: { type: String, default: 'More ideas' },
  // Center the chips (card surfaces) vs left-align (form surfaces).
  center: { type: Boolean, default: false },
});

defineEmits(['select', 'refresh']);
</script>

