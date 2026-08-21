<template>
  <!-- Edge padding comes from Ionic's own `ion-padding-horizontal` utility
       (16px via --ion-padding), plus ion-grid's built-in 5px vertical — no
       hand-written CSS, so it tracks the theme's padding scale instead of a
       magic number. This lives on the COMPONENT because it used to be left to
       each host, and the four hosts promptly diverged: one used a custom class,
       one used ion-margin-horizontal, the lesson modals padded the stepper
       wrapper, and love-well's onboarding footer had nothing at all — its
       buttons sat flush against the screen edges.
       Note the grid deliberately does NOT carry `ion-no-padding`: that zeroed
       the very padding this needs. -->
  <ion-grid class="ion-padding-horizontal modal-footer-nav">
    <ion-row class="ion-align-items-center">
      <!-- Back / leading secondary — content width, so the primary keeps the
           rest. Renders when `backLabel` is set (or #start is provided). -->
      <ion-col v-if="backLabel || $slots.start" size="auto">
        <slot name="start">
          <ion-button
            size="small"
            fill="outline"
            color="medium"
            :disabled="backDisabled"
            @click="$emit('back')">
            <ion-icon v-if="backIcon" :icon="backIcon" slot="start" />
            {{ backLabel }}
          </ion-button>
        </slot>
      </ion-col>

      <!-- `#columns` — for footers needing SEVERAL columns beside Back (e.g. a
           lesson choice step's "Still fuzzy" + "I get it"): rendered straight
           into this row so they split the remaining width evenly. -->
      <slot v-if="$slots.columns" name="columns" />

      <!-- Default slot — a step/mode-dependent button chain in one column. -->
      <ion-col v-else-if="$slots.default">
        <slot />
      </ion-col>

      <!-- Prop-driven buttons — the declarative common case. Secondary sits
           left of primary; both split the width left beside Back. -->
      <template v-else>
        <ion-col v-if="secondaryLabel">
          <ion-button
            size="small"
            expand="block"
            fill="outline"
            color="primary"
            :disabled="secondaryDisabled || secondaryLoading"
            @click="$emit('secondary')">
            <ion-spinner v-if="secondaryLoading" name="dots" slot="start" />
            <ion-icon
              v-else-if="secondaryIcon"
              :icon="secondaryIcon"
              :slot="secondaryIconEnd ? 'end' : 'start'" />
            {{ secondaryLabel }}
          </ion-button>
        </ion-col>
        <ion-col v-if="primaryLabel">
          <ion-button
            size="small"
            expand="block"
            color="primary"
            :disabled="primaryDisabled || primaryLoading"
            @click="$emit('primary')">
            <ion-spinner v-if="primaryLoading" name="dots" slot="start" />
            <ion-icon
              v-else-if="primaryIcon"
              :icon="primaryIcon"
              :slot="primaryIconEnd ? 'end' : 'start'" />
            {{ primaryLabel }}
          </ion-button>
        </ion-col>
      </template>
    </ion-row>
  </ion-grid>
</template>

<script setup>
import { chevronBack } from 'ionicons/icons';
// The suite's modal footer nav — a content-width Back (or other secondary)
// beside a primary that fills the remaining width, on one row. Owns the
// grid/row/col shape, because that layout was hand-rolled identically in every
// stepper-ish modal (lesson stepper, practice walk-through, onboarding) and
// drifted (a missing ion-grid wrapper or an empty `size=""` silently breaks
// the fill).
//
// Each button is described by its OWN props, so a consumer can see exactly
// what a footer takes; a button renders only when its `*Label` is set.
// Buttons emit (`back` / `primary` / `secondary`) rather than taking handlers.
//
// Three ways to fill the action side, in precedence order:
//   #columns  — raw ion-cols into the row (several CTAs beside Back)
//   #default  — one column holding a custom button chain
//   props     — primary/secondary below, the declarative common case
// `#start` replaces the Back button entirely with a custom control.
defineProps({
  // ── Back / leading secondary (outline + medium) ──
  // Set to render it; omit for a start-less footer.
  backLabel: { type: String, default: null },
  // Pass null for a plain label (e.g. a "Not now" skip, where a back-chevron
  // would misdescribe the action).
  backIcon: { type: [String, Object], default: () => chevronBack },
  backDisabled: { type: Boolean, default: false },

  // ── Primary (solid) ──
  primaryLabel: { type: String, default: null },
  primaryIcon: { type: [String, Object], default: null },
  // Trail the icon — forward chevrons/arrows read better after the label.
  primaryIconEnd: { type: Boolean, default: false },
  primaryDisabled: { type: Boolean, default: false },
  // Swaps the icon for a spinner and disables the button (in-flight saves).
  primaryLoading: { type: Boolean, default: false },

  // ── Secondary (outline), sits left of primary ──
  secondaryLabel: { type: String, default: null },
  secondaryIcon: { type: [String, Object], default: null },
  secondaryIconEnd: { type: Boolean, default: false },
  secondaryDisabled: { type: Boolean, default: false },
  secondaryLoading: { type: Boolean, default: false },
});

defineEmits(['back', 'primary', 'secondary']);
</script>
