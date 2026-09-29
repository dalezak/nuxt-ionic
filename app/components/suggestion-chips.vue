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
    suggestions  — label strings, or `{ label, icon?, color? }` objects. Chips
                   all look alike; give each kind its own icon to tell them
                   apart (a user's own insight vs a generic starter).
    selected     — highlights the chip whose label matches this value
    refreshLabel — refresh-button text (default "More ideas"); '' hides it
    center       — center the chips (card surfaces) vs left-align (form surfaces)

  Emits: select (the tapped suggestion, as passed — string or object), refresh.
-->
<template>
  <div class="suggestion-chips">
    <div class="suggestion-chips-list" :class="{ 'suggestion-chips-list--center': center }">
      <ion-chip
        v-for="item in items"
        :key="item.label"
        :color="selected === item.label ? 'primary' : (item.color ?? 'medium')"
        :outline="selected !== item.label"
        @click="$emit('select', item.raw)">
        <ion-icon v-if="item.icon" :icon="item.icon" />
        <ion-label>{{ item.label }}</ion-label>
      </ion-chip>
    </div>
    <ion-button v-if="refreshLabel" fill="clear" size="small" expand="block" class="suggestion-chips-refresh" @click="$emit('refresh')">
      <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
      {{ refreshLabel }}
    </ion-button>
  </div>
</template>

<script setup>
import { refreshOutline } from 'ionicons/icons';
const props = defineProps({
  // Label strings, or { label, icon?, color? } objects.
  suggestions: { type: Array, default: () => [] },
  // Highlights the chip whose label matches (e.g. the currently chosen topic).
  selected: { type: String, default: null },
  // Refresh button label — "More ideas" (default) / "Refresh List" / etc.
  // Empty hides the button, for a list with nothing more to deal.
  refreshLabel: { type: String, default: 'More ideas' },
  // Center the chips (card surfaces) vs left-align (form surfaces).
  center: { type: Boolean, default: false },
});

defineEmits(['select', 'refresh']);

// Every chip renders the same; an `icon` is how a list tells kinds of
// suggestion apart (love-well: sparkles for the user's own insights, a bulb for
// generic starters). A different fill for one kind read as "already selected".
//
// Outlined + medium until picked, then filled primary — the same shape as the
// coach's starter chips and as <filter-chips>' inactive state, so an offer
// reads as an offer. The default solid grey fill read heavier than the text
// field it sits under.
const items = computed(() => props.suggestions.map(s => (typeof s === 'string'
  ? { label: s, raw: s }
  : { label: s.label, icon: s.icon ?? null, color: s.color, raw: s })));
</script>

<style lang="scss">
.suggestion-chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.suggestion-chips-list--center {
  justify-content: center;
}
.suggestion-chips-list ion-chip {
  margin: 0;
}
.suggestion-chips-refresh {
  margin-top: var(--space-2);
}
</style>
