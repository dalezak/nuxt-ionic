<!--
  section-card — the workhorse card primitive for the suite. Wraps
  Ionic's `<ion-card>` family with a consistent header + body + footer
  shape, design-token-driven chrome, and an optional left-accent stripe
  that encodes the card's MODE OF ENGAGEMENT — "what does this card want
  from me?": `learn` (take in) · `act` (do) · `reflect` (turn inward) ·
  `nudge` (respond) · `connect` (someone in your circle) · `alert` (careful).
  Accent is opt-in — plain (no accent) is the default for neutral/glance
  cards, so the accented ones read as signal. See `card-tokens.css` for the
  rule. (`witness` is a legacy alias kept for any-learn.)

  The header row defaults to: [icon] [title + subtitle] [header-end slot
  or disclosure arrow]. Each piece is independently optional — every
  prop is nullable; pass only what you need.

  Body is a default slot. The footer supports both: prop-driven CTAs
  (`primaryCta` / `secondaryCta` / `tertiaryCta` / `actions`) for the common
  button case — centralized so spacing/order/fill stay consistent — AND a free-form
  `#footer` slot for richer footers (links, chip rows, custom layout). The
  slot renders above the prop CTAs, so they compose.

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
        <ion-button size="small" fill="clear" expand="block">Load More</ion-button>
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

    <ion-card-content
      v-if="$slots.default || labels.length"
      class="section-card-body"
      :class="{ 'section-card-body--has-footer': hasFooter }">
      <slot />
      <!-- Prop-driven metadata pills — a consistent, same-spot chip row under the
           body content on every card. (Slot content can still render its own
           label-chips, but prefer the `labels` prop.) -->
      <label-chips v-if="labels.length" :items="labels" class="section-card-labels" />
    </ion-card-content>

    <div v-if="hasFooter" class="section-card-footer">
      <slot name="footer" />

      <!-- Prop-driven CTAs — the common 1–3 button footer, centralized so
           spacing/order/fill stay consistent across the suite. Left→right by
           increasing prominence: tertiary (grey outline), secondary (outline),
           primary (solid). Laid out as an ion-grid of equal auto columns, so the
           buttons sit SIDE-BY-SIDE on every breakpoint (a lone CTA grows to full
           width). Keep labels short — long ones truncate in a narrow column. For
           anything richer (links, chip rows, custom layout) use #footer. -->
      <ion-grid v-if="resolvedCtas.length" class="section-card-ctas ion-no-padding">
        <ion-row class="section-card-ctas-row">
          <ion-col
            v-for="c in resolvedCtas"
            :key="c.kind"
            class="ion-no-padding">
            <ion-button
              class="section-card-cta"
              expand="block"
              size="small"
              :fill="c.fill"
              :color="c.color"
              :disabled="c.cta.disabled || c.cta.loading || undefined"
              @click.stop="run(c.cta, c.kind)">
              <ion-spinner v-if="c.cta.loading" slot="start" name="dots" />
              <ion-icon v-else-if="c.cta.icon" :icon="c.cta.icon" slot="start" />
              {{ c.cta.label }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Additional/tertiary actions — clear icon+text buttons below the CTAs
           (e.g. a quote's Favorite / Share / Reflect row). -->
      <div v-if="actions.length" class="section-card-actions">
        <ion-button
          v-for="(a, i) in actions"
          :key="a.key ?? i"
          class="section-card-action"
          fill="clear"
          size="small"
          :color="a.color || 'medium'"
          :disabled="a.disabled || a.loading || undefined"
          @click.stop="run(a, 'action', a.key ?? i)">
          <ion-spinner v-if="a.loading" slot="start" name="dots" />
          <ion-icon v-else-if="a.icon" :icon="a.icon" slot="start" />
          {{ a.label }}
        </ion-button>
      </div>
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
    validator: (v) => v == null || ['learn', 'act', 'reflect', 'nudge', 'connect', 'alert', 'witness'].includes(v),
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

  // ── Footer CTAs (the common button-footer case, prop-driven) ──────────
  // Primary/secondary render as a button row below the body; primary is
  // solid, secondary outline (override via `fill`). Each is a self-describing
  // action object:
  //   { label, icon?, fill?, color?, disabled?, loading?, onClick? }
  // `loading: true` swaps the icon for a spinner and disables the button (for
  // in-flight saves). Tap runs the object's `onClick` if present, else emits
  // `primary` / `secondary`. For richer footers (links, chip rows, custom
  // layout), use the #footer slot — it still works and renders above these.
  primaryCta: { type: Object, default: null },
  secondaryCta: { type: Object, default: null },

  // Tertiary CTA — a third button sharing the CTA row, sitting LEFT of
  // secondary (weakest of the three). Same self-describing action-object shape
  // as primary/secondary. Defaults to a subdued grey outline
  // (`fill: 'outline'`, `color: 'medium'`) so it reads as the least prominent
  // action without extra styling; override `fill`/`color` per use. Tap runs the
  // object's `onClick` if present, else emits `tertiary`. Not to be confused
  // with `actions` (clear icon+text buttons on their own row below the CTAs).
  tertiaryCta: { type: Object, default: null },

  // Additional/tertiary actions — an array of clear icon+text buttons below
  // the CTAs (e.g. a quote's Favorite / Share / Reflect row). Each is the same
  // action-object shape: { label, icon?, color?, disabled?, loading?, key?, onClick? }.
  // Tap runs `onClick` if present, else emits `action` with `key` (or index).
  // Build the array as a computed so labels/icons stay reactive (e.g. Favorite
  // ⇄ Favorited). Order is preserved.
  actions: { type: Array, default: () => [] },

  // Metadata pills, rendered under the body via <label-chips> — the consistent,
  // declarative way to show chips on a card (same item shape as label-chips:
  // { label, icon?, emoji?, color?, filled?, titlecase? }). Prefer this over
  // dropping a <label-chips> in the default slot, so pills land in the same spot
  // on every card across the suite.
  labels: { type: Array, default: () => [] },
});

const emit = defineEmits(['click', 'primary', 'secondary', 'tertiary', 'action']);

// Resolve icon color: explicit prop wins, otherwise follow the accent.
// Falls back to medium (Ionic's neutral gray) for un-accented icons so
// they don't compete visually with title text.
const resolvedIconColor = computed(() => {
  if (props.iconColor) return props.iconColor;
  if (!props.accent) return 'medium';
  // `connect` is a custom (non-Ionic) rose token, so Ionic's `color` attr
  // can't name it — return undefined so the icon inherits currentColor and the
  // scoped `.section-card--accent-connect .section-card-icon` rule tints it.
  if (props.accent === 'connect') return undefined;
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

// Footer renders when there's slot content OR any prop-driven CTA/action.
const hasFooter = computed(() => {
  return !!slots.footer
    || !!props.primaryCta
    || !!props.secondaryCta
    || !!props.tertiaryCta
    || props.actions.length > 0;
});

// Present CTAs resolved to render order (weakest → strongest, left → right)
// with each one's fill/color defaults folded in — so the template stays a
// single v-for instead of three near-identical button blocks. tertiary defaults
// to a subdued grey outline; secondary to a plain outline; primary to solid.
const resolvedCtas = computed(() => {
  return [
    { kind: 'tertiary', cta: props.tertiaryCta, fill: 'outline', color: 'medium' },
    { kind: 'secondary', cta: props.secondaryCta, fill: 'outline', color: undefined },
    { kind: 'primary', cta: props.primaryCta, fill: 'solid', color: undefined },
  ]
    .filter(d => d.cta)
    .map(d => ({
      kind: d.kind,
      cta: d.cta,
      fill: d.cta.fill || d.fill,
      color: d.cta.color || d.color,
    }));
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

// Run a footer action. Prefer the action object's own `onClick` handler (the
// self-describing style — no key→switch needed); fall back to the matching
// event so consumers can use `@primary` / `@secondary` / `@action` instead.
function run(action, eventName, key) {
  if (typeof action?.onClick === 'function') { action.onClick(); return; }
  emit(eventName, key);
}
</script>

