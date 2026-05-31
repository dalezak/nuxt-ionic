<template>
  <section-card
    :accent="accent"
    :background="tinted ? resolvedBackground : null"
    class="stat-tile">
    <div class="stat-tile-content">
      <ion-icon
        v-if="icon"
        :icon="icon"
        :color="resolvedIconColor"
        class="stat-tile-icon" />
      <div class="stat-tile-value">{{ value }}</div>
      <div class="stat-tile-label">{{ label }}</div>
    </div>
  </section-card>
</template>

<!--
  stat-tile — a single stat card. Renders an icon, big value, and small
  uppercase label, wrapped in a section-card with an accent stripe and
  optional matching tinted background.

  Typical use is a row of 3 tiles at the top of a profile-style page:

    <div class="stats-row">
      <stat-tile accent="learn" :icon="ioniconsBookOutline"
                 :value="stats.courses" label="Courses" tinted />
      <stat-tile accent="act" :icon="ioniconsCheckmarkDoneOutline"
                 :value="stats.lessons" label="Lessons" tinted />
      <stat-tile accent="reflect" :icon="ioniconsSpeedometerOutline"
                 :value="`${stats.avgScore}%`" label="Avg Score" tinted />
    </div>

  Accent encodes purpose (matches section-card's accent semantics).
  Icon color auto-resolves from accent unless `iconColor` is set
  explicitly. `tinted` auto-derives a soft background tint from the
  accent's Ionic palette color — pass `background` directly to override.
-->

<script setup>
const props = defineProps({
  // Section-card accent name. Drives stripe color, default icon color,
  // and (when `tinted`) the background tint.
  accent: {
    type: String,
    default: null,
    validator: (v) => v == null || ['learn', 'act', 'reflect', 'witness', 'nudge', 'alert'].includes(v),
  },
  icon: { type: [String, Object], default: null },
  // Explicit icon color override. Defaults to the Ionic color matching
  // the accent (learn→primary, act→success, etc.).
  iconColor: { type: String, default: null },
  // The focal number / metric. Pass a number for raw counts or a
  // formatted string for percentages, units, etc. ("87%", "12 min").
  value: { type: [String, Number], default: '—' },
  // Small uppercase label rendered below the value.
  label: { type: String, default: '' },
  // When true, sets `background` on the section-card to a soft tint
  // matching the accent — keeps the tile visually grouped with its
  // accent stripe. Skip for plain white cards.
  tinted: { type: Boolean, default: false },
});

// Accent → Ionic color name. Same mapping section-card uses for its
// `iconColor` fallback; duplicated here so stat-tile stays standalone
// (doesn't reach into section-card's internals).
const ACCENT_TO_ION = {
  learn: 'primary', act: 'success', reflect: 'tertiary',
  witness: 'tertiary', nudge: 'warning', alert: 'danger',
};

// Warning is the lightest of the Ionic palette colors — needs a touch
// more alpha than the rest to feel as present visually. Others share
// the same 0.08 default.
const TINT_OPACITY = {
  learn: 0.08, act: 0.08, reflect: 0.08,
  witness: 0.08, nudge: 0.10, alert: 0.08,
};

const resolvedIconColor = computed(() =>
  props.iconColor ?? ACCENT_TO_ION[props.accent] ?? 'medium',
);

const resolvedBackground = computed(() => {
  const ion = ACCENT_TO_ION[props.accent] ?? 'primary';
  const opacity = TINT_OPACITY[props.accent] ?? 0.08;
  return `rgba(var(--ion-color-${ion}-rgb), ${opacity})`;
});
</script>

<style scoped>
.stat-tile {
  margin: 0;
  /* Tighter inner padding than the default section-card (1rem) so short
     single-word labels (COURSES, LESSONS) have enough content width to
     fit on one line in narrow grid cells. */
  --card-padding: 0.6rem;
}
.stat-tile-content {
  text-align: center;
}
.stat-tile-icon {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
}
.stat-tile-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--ion-text-color);
  line-height: 1;
  margin-bottom: 0.25rem;
  /* Keep values like "80%" or "1.2k" intact — % and . are treated as
     separable by default, so without nowrap they break to the next line
     in narrow cells. */
  white-space: nowrap;
}
.stat-tile-label {
  /* Tightened size + letter-spacing so single-word labels (COURSES,
     LESSONS, STREAK) fit on one line in narrow cells. Multi-word labels
     still wrap on word boundary, single words now overflow gracefully
     instead of breaking mid-word ("COURS / ES"). */
  font-size: 0.65rem;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
</style>
