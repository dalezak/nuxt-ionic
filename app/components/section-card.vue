<!--
  section-card — the workhorse card primitive for the suite. Wraps
  Ionic's `<ion-card>` family with a consistent header + body + footer
  shape, design-token-driven chrome, and an optional left-accent stripe
  that encodes the card's PURPOSE (`learn` / `act` / `reflect` /
  `witness` / `nudge` / `alert` — see `card-tokens.css`).

  The header row defaults to: [icon] [title + subtitle] [header-end slot
  or disclosure arrow]. Each piece is independently optional — every
  prop is nullable; pass only what you need.

  Body is a default slot; footer is a slot. Footer markup varies too
  much across cards (button, link, chip row, multiple actions) for
  prop-shaped APIs to feel clean.

  Tappable + navigation:
    - `tappable` adds Ionic's `button` shape with hover/press states
    - `to` wraps the card content in router navigation (uses
      ion-card's built-in `router-link` prop — no extra wrapper)

  Accessibility:
  When `tappable` or `to` is set the card becomes a focusable button.
  Pass a meaningful `title` (or `aria-label` on the host) so screen
  readers can name the action — without one, the button announces only
  whatever body content it can synthesize.

  Conflict resolution between #header-end slot and `disclosure` prop:
  slot wins. If the slot has content, it renders; otherwise the chevron
  renders when `disclosure` is true. One space, two ways to fill it.

  Slots:
    - `media`      — full-bleed media above the header (an `<img>`, a
                     `<video>`, a chart). Ionic renders it edge-to-edge
                     of the card; consumer controls aspect ratio.
    - default      — body content. Wrapped in `<ion-card-content>` so
                     Ionic's typography defaults apply.
    - `footer`     — actions/links below the body. Free-form markup;
                     padded the same as the body but with its own gap.
    - `header`     — escape hatch that replaces the entire default
                     header layout (icon + titles + header-end). Use
                     when the standard row doesn't fit (e.g. a title
                     with an inline status chip, a media-first header).
    - `header-end` — content for the top-right slot of the standard
                     header. Wins over the `disclosure` chevron.

  Icon prop accepts an ionicons import (a string under the hood) or
  any Vue-compatible icon component.

  Examples:

    <section-card
      accent="learn"
      :icon="ioniconsBookOutline"
      title="The Dichotomy"
      subtitle="Day 1 — 21 Days with Marcus Aurelius"
      :disclosure="true"
      to="/lessons/dichotomy">
      <p>What's up to you, what isn't.</p>
    </section-card>

    <section-card
      :icon="ioniconsPeopleOutline"
      title="Witness"
      subtitle="Moments from your circle.">
      <witness-list :items="activity" />
      <template #footer>
        <ion-button fill="clear" expand="block">Load More</ion-button>
      </template>
    </section-card>
-->

<template>
  <ion-card
    class="section-card"
    :class="cardClasses"
    :style="background ? { '--background': background } : null"
    :button="tappable || !!to || undefined"
    :router-link="to || undefined"
    @click="onClick">

    <!-- Left accent stripe — colored via CSS var resolved from the
         `accent` prop (semantic) or `accentColor` prop (raw override
         for data-driven cases like pillar colors). Pure decoration;
         pointer-events: none so it never interferes with taps. -->
    <div
      v-if="hasAccent"
      class="section-card-accent"
      :style="accentColor ? `--accent-color: ${accentColor}` : null" />

    <!-- Full-bleed media (above the header). Ionic renders direct
         children of ion-card edge-to-edge; consumer styles aspect. -->
    <slot name="media" />

    <ion-card-header v-if="hasHeader" class="section-card-header">
      <!-- Escape-hatch slot. When present, replaces the entire default
           header layout (icon + title + subtitle + end). -->
      <slot name="header">
        <div class="section-card-header-row">
          <ion-icon
            v-if="icon"
            :icon="icon"
            :color="resolvedIconColor"
            class="section-card-icon" />

          <div class="section-card-titles">
            <ion-card-title v-if="title" class="section-card-title">
              {{ title }}
            </ion-card-title>
            <p v-if="subtitle" class="section-card-subtitle">{{ subtitle }}</p>
          </div>

          <!-- Top-right area. Slot wins; chevron is the disclosure
               shortcut for the common nav-card case. -->
          <div class="section-card-header-end">
            <slot name="header-end">
              <ion-icon
                v-if="disclosure"
                :icon="ioniconsChevronForwardOutline"
                class="section-card-disclosure" />
            </slot>
          </div>
        </div>
      </slot>
    </ion-card-header>

    <ion-card-content v-if="$slots.default" class="section-card-body">
      <slot />
    </ion-card-content>

    <div v-if="$slots.footer" class="section-card-footer">
      <slot name="footer" />
    </div>
  </ion-card>
</template>

<script setup>
import { chevronForwardOutline as ioniconsChevronForwardOutline } from 'ionicons/icons';

const props = defineProps({
  // Semantic accent name — encodes purpose, not color. Maps to
  // `--card-accent-<accent>` from card-tokens.css. Apps re-skin by
  // overriding the token, not by changing accent names.
  //
  // Valid set is inlined in the validator because `defineProps` is
  // hoisted above the setup() scope and can't reference local consts.
  // If you add an accent name, also: extend the `iconColor` fallback
  // map below and add a `.section-card--accent-<name>` rule + a
  // `--card-accent-<name>` token in card-tokens.css.
  accent: {
    type: String,
    default: null,
    validator: (v) => v == null || ['learn', 'act', 'reflect', 'witness', 'nudge', 'alert'].includes(v),
  },

  // Raw color override for data-driven accents (e.g. a pillar color,
  // a user-picked theme color). When set, the stripe renders with this
  // color regardless of `accent`. Accepts any CSS color value (hex,
  // rgb, var(--ion-color-*), etc.). Use this when the stripe color is
  // computed from data; use `accent` when it's semantic.
  accentColor: { type: String, default: null },

  // Card background — sets Ionic's `--background` CSS var on the root
  // ion-card. Accepts any CSS color value. Use sparingly: most cards
  // should use the default white surface so the accent stripe carries
  // the per-card identity. Reach for this when a tinted background is
  // load-bearing for the surface (e.g. stat tiles tinted to match the
  // accent stripe, or a "this is special" hero card).
  // Common pattern: `rgba(var(--ion-color-<name>-rgb), 0.06)` for a
  // subtle tint that picks up the app's palette automatically.
  background: { type: String, default: null },

  // Top-left ionicon. Optional.
  icon: { type: [String, Object], default: null },

  // Override the icon's color. By default it follows the accent (so
  // a card with `accent="act"` gets a success-colored icon). Pass an
  // explicit Ionic color name to decouple.
  iconColor: { type: String, default: null },

  // Header text. Both optional and independent — a card can have a
  // title without a subtitle, a subtitle without a title (rare), or
  // neither (icon-only header, e.g. media-first cards).
  title: { type: String, default: null },
  subtitle: { type: String, default: null },

  // Top-right chevron that signals "this card opens another surface."
  // Shortcut for the common nav-card case; if you need anything more
  // specific (close button, status chip, menu), use the #header-end
  // slot instead — slot wins over disclosure.
  disclosure: { type: Boolean, default: false },

  // Whole-card tappable: applies Ionic's `button` shape (hover/press
  // states, focus ring). Independent of `to` — set this when the card
  // is tappable but doesn't navigate (e.g. expands inline, opens a
  // modal). When `to` is set, button-shape is implicit.
  tappable: { type: Boolean, default: false },

  // Router navigation target. Uses ion-card's built-in `router-link`
  // support — no extra <NuxtLink> wrapper needed.
  to: { type: String, default: null },
});

const emit = defineEmits(['click']);

// Resolve icon color: explicit prop wins, otherwise follow the accent.
// Falls back to medium (Ionic's neutral gray) for un-accented icons so
// they don't compete visually with title text.
const resolvedIconColor = computed(() => {
  if (props.iconColor) return props.iconColor;
  if (!props.accent) return 'medium';
  // Map our semantic accent names to the Ionic color a stock icon
  // expects. Apps that override --card-accent-<name> in their theme
  // can override this mapping by passing iconColor explicitly.
  return {
    learn: 'primary',
    act: 'success',
    reflect: 'tertiary',
    witness: 'tertiary',
    nudge: 'warning',
    alert: 'danger',
  }[props.accent] ?? 'primary';
});

// Include slot check so the #header escape hatch keeps rendering even
// when no props are passed (e.g. practice-card builds its own complex
// header inside the slot with no icon/title/subtitle prop).
const slots = useSlots();
const hasHeader = computed(() => {
  return !!props.icon
    || !!props.title
    || !!props.subtitle
    || !!props.disclosure
    || !!slots.header
    || !!slots['header-end'];
});

// True when either the semantic `accent` or the raw `accentColor`
// resolves to a visible stripe. Drives the stripe v-if AND the
// content-shift class so left-padding clears the stripe.
const hasAccent = computed(() => !!props.accent || !!props.accentColor);

const cardClasses = computed(() => ({
  // Semantic accent class only applies when accentColor isn't an
  // explicit override — inline style on the stripe wins for data-driven
  // colors.
  [`section-card--accent-${props.accent}`]: !!props.accent && !props.accentColor,
  // Content padding shifts right when a stripe is present so the icon
  // and titles don't crowd against the colored bar.
  'section-card--has-accent': hasAccent.value,
  'section-card--tappable': props.tappable || !!props.to,
}));

function onClick(event) {
  emit('click', event);
}
</script>

<style scoped>
.section-card {
  /* Chrome (radius, shadow, background, margin, hover/press) is left
     to Ionic's <ion-card> defaults so platform adaptations (iOS vs
     Material) and theme inheritance work out of the box. Apps that
     want a custom look re-skin in their own theme.css by targeting
     `ion-card` or `.section-card` — we don't fight Ionic from here.

     The two structural rules we do own:
       position: relative — anchor for the accent stripe overlay
       overflow: hidden   — clip the stripe inside the card's rounded
                            corners (Ionic's default border-radius). */
  position: relative;
  overflow: hidden;
}

/* Left accent — uses a positioned div rather than `border-left` so it
   sits crisply against the rounded corner without weird seam lines on
   sub-pixel devices. Color is resolved from the accent name to its
   token. */
.section-card-accent {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--card-accent-width);
  background: var(--accent-color, transparent);
  pointer-events: none;
}

.section-card--accent-learn   { --accent-color: var(--card-accent-learn); }
.section-card--accent-act     { --accent-color: var(--card-accent-act); }
.section-card--accent-reflect { --accent-color: var(--card-accent-reflect); }
.section-card--accent-witness { --accent-color: var(--card-accent-witness); }
.section-card--accent-nudge   { --accent-color: var(--card-accent-nudge); }
.section-card--accent-alert   { --accent-color: var(--card-accent-alert); }

.section-card-header {
  padding: var(--card-padding) var(--card-padding) 0;
}

/* Header-only cards (no body slot, no footer slot) — give the header
   its own bottom padding so the card doesn't collapse against the
   subtitle. Catches evening-prompt-card, all-done-beat, and any other
   icon+title+subtitle-only surface. */
.section-card-header:last-child {
  padding-bottom: var(--card-padding);
}

.section-card-header-row {
  display: flex;
  align-items: flex-start;
  gap: var(--card-header-gap);
}

.section-card-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.section-card-titles {
  flex: 1 1 auto;
  min-width: 0;
}

.section-card-title {
  font-size: var(--card-title-size);
  font-weight: var(--card-title-weight);
  margin: 0;
  /* Break long words so a long title wraps inside the card on narrow screens
     instead of overflowing the header row. The titles container is min-width:0
     so normal multi-word titles already wrap; this covers unbreakable strings. */
  overflow-wrap: break-word;
}

.section-card-subtitle {
  margin: 0.15rem 0 0;
  font-size: var(--card-subtitle-size);
  color: var(--card-subtitle-color);
  line-height: 1.4;
  overflow-wrap: break-word;
}

.section-card-header-end {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.section-card-disclosure {
  font-size: 1.1rem;
  color: var(--ion-color-medium);
}

/* `.section-card-body` IS the ion-card-content (the class is applied
   to the element), so our scoped class selector beats Ionic's default
   padding without needing a `:deep` descendant rule. */
.section-card-body {
  padding: var(--card-body-gap) var(--card-padding) var(--card-padding);
}

.section-card-footer {
  padding: var(--card-footer-gap) var(--card-padding) var(--card-padding);
}

/* Content shift when the left accent stripe is present — header, body,
   and footer all gain `accent-width` of additional left padding so the
   stripe gets its own breathing room. Single class on the host card
   keeps this declarative; no per-slot conditional logic. */
.section-card--has-accent .section-card-header,
.section-card--has-accent .section-card-body,
.section-card--has-accent .section-card-footer {
  padding-left: calc(var(--card-padding) + var(--card-accent-width));
}
</style>
