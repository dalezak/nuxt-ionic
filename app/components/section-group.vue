<template>
  <!-- STATIC (collapsible=false, the default) — "arrow hidden, always expanded":
       an eyebrow heading + optional subtitle + optional body. No ion-accordion
       is instantiated on this path, so a plain section label pays zero framework
       cost. This is the old <section-heading>. -->
  <div v-if="!collapsible" class="section-group section-group--static">
    <h3 class="section-group-heading"><slot name="title">{{ title }}</slot></h3>
    <p v-if="subtitle" class="section-group-subtitle">{{ subtitle }}</p>
    <slot />
  </div>

  <!-- COLLAPSIBLE — one self-contained ion-accordion. The accordion-group is the
       root so an inherited id (e.g. today-section-morning) lands on a real,
       scrollable element. Content stays in the DOM when folded, so form state +
       async-loaded cards survive a collapse (like the old v-show body). -->
  <ion-accordion-group
    v-else
    class="section-group section-group--collapsible"
    :class="{ 'section-group--active': active }"
    :value="open ? ACCORDION_VALUE : undefined"
    @ion-change="onIonChange">
    <ion-accordion
      :value="ACCORDION_VALUE"
      :toggle-icon="chevronDownOutline"
      toggle-icon-slot="end">
      <!-- Header is an ion-item (Ionic's idiomatic accordion header): a real
           focusable button, so keyboard toggle + aria-expanded come free. Its
           card/item chrome (background, divider, ripple, inset padding,
           min-height) is stripped via the item CSS vars below; `lines="none"` +
           `:detail="false"` kill the divider + iOS detail arrow.

           The disclosure chevron is Ionic's BUILT-IN toggleIcon — it auto-rotates
           and is driven by the accordion's OWN expanded state, so it can't
           desync the way a hand-bound `<ion-icon :icon="open ? …">` did across
           SSR hydration (that bug is why we don't roll our own here). -->
      <ion-item slot="header" lines="none" :detail="false" class="section-group-header-item">
        <div class="section-group-header">
          <div class="section-group-heading-block">
            <span class="section-group-label"><slot name="title">{{ title }}</slot></span>
            <span v-if="subtitle" class="section-group-subtitle">{{ subtitle }}</span>
          </div>
          <!-- Flexible middle — always present so the badge stays pinned right
               (next to the built-in toggle icon) whether or not a summary shows.
               Holds the collapsed-only preview. -->
          <span class="section-group-spacer">
            <span v-if="summary && !open" class="section-group-summary">{{ summary }}</span>
          </span>
          <span v-if="badge" class="section-group-badge">{{ badge }}</span>
        </div>
      </ion-item>
      <div slot="content" class="section-group-body"><slot /></div>
    </ion-accordion>
  </ion-accordion-group>
</template>

<!--
  section-group — one labelled-section primitive for the whole suite. Unifies the
  old <section-heading> (static eyebrow label) and <section-collapsible> (foldable
  labelled section) behind a single `collapsible` flag, built on Ionic's
  ion-accordion so the collapsible case gets framework animations, iOS/MD theming,
  expand/collapse events, and keyboard a11y — with one source of truth for the
  eyebrow look.

    Static (default) — arrow hidden, always expanded:
      <section-group title="Recent" />
      <section-group title="Saved" subtitle="Your favorited items" />
      <section-group v-if="hasSection"><template #title>Actions 🔥 {{ n }}</template></section-group>

    Collapsible — one ion-accordion, title prop = label, default slot = body:
      <section-group collapsible v-model="open" title="Morning"
                     :active="isNow" :badge="isNow ? 'now' : ''" :summary="peek">
        …cards…
      </section-group>

  Props:
    title       — the heading label (both modes); or use the #title slot for rich content
    subtitle    — quiet secondary line under the title, always visible (both modes)
    summary     — collapsed-only one-line preview in the header (collapsible; hidden when open)
    badge       — small pill beside the label (collapsible, e.g. "now")
    active      — accent-tint the heading to mark the live/current section (collapsible)
    collapsible — false (default) → static eyebrow; true → foldable accordion
  v-model:
    modelValue  — open/closed (collapsible). Parent-controlled, so it can seed the
                  initial state and drive it programmatically (e.g. reveal-on-tap).
  Slots:
    #title      — rich label content, overrides the `title` prop
    default     — the body (optional; shown always when static, toggled when collapsible)
-->

<script setup>
import { chevronDownOutline } from 'ionicons/icons';
// One fixed value identifying this instance's single accordion. The group is
// "open" (value === this) or "closed" (value === undefined).
const ACCORDION_VALUE = 'section';

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  summary: { type: String, default: '' },
  badge: { type: String, default: '' },
  active: { type: Boolean, default: false },
  collapsible: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

// Open-state is a WRITABLE COMPUTED over the prop — no local ref, no watcher.
//
// This component previously kept `const open = ref(props.modelValue)` synced to
// the prop with a watcher, and that second source of truth is what caused every
// bug it has had: local and parent could disagree, and nothing guaranteed they
// converged. Ionic's accordion re-emits its value on load (see below), which
// flipped local `open` to false while the parent still said true — the section
// rendered collapsed with no way back, because the prop never changed so the
// watcher never fired.
//
// With a computed there IS no local copy: the parent's value is the state, and
// a toggle is just an emit. Desync is unrepresentable.
const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// Only `ionChange` (a real user toggle) is handled. `ionValueChange` is
// deliberately ignored: ion-accordion-group's componentDidLoad calls
// valueChanged() unconditionally, emitting the current `value` — `undefined`
// before Vue applies `:value`. That is indistinguishable from a collapse, so
// listening to it made any section that mounts open immediately fold itself.
// Nothing needs it: the chevron is Ionic's own toggleIcon (driven by the
// accordion's internal state), so `open` only feeds `:value` and the summary.
function onIonChange(event) {
  const isOpen = event.detail.value === ACCORDION_VALUE;
  if (isOpen !== open.value) open.value = isOpen;
}
</script>

<style lang="scss">
/* ── Eyebrow, defined ONCE and shared by both branches ─────────────────────
 Mirrors <section-title>'s quiet supporting sibling: uppercase, letterspaced,
 medium — a grouping label that doesn't compete with card titles. */
.section-group-heading,
.section-group-label {
 font-size: var(--text-xs);
 font-weight: var(--weight-medium);
 text-transform: uppercase;
 letter-spacing: 0.06em;
 color: var(--ion-color-medium);
}

/* Static branch — the old .section-heading box model. The block margin lives on
 the ROOT (not the <h3>) so a caller's fall-through class (e.g. a divider that
 tightens `margin-top`) overrides it just like it did on the old bare <h3>. */
.section-group--static {
 margin: var(--space-5) 0 var(--space-1);
}
.section-group-heading {
 margin: 0;
}

/* Quiet secondary line under the title (both modes). Absorbs patterns that used
 to be hand-rolled as a <p> after the heading. */
.section-group-subtitle {
 margin: 0 0 var(--space-1);
 font-size: var(--text-xs);
 line-height: var(--leading-tight);
 color: var(--ion-color-medium-shade);
}

/* ── Collapsible branch ───────────────────────────────────────────────────── */

/* Same top/bottom rhythm the static eyebrow carries; transparent so the section
 inherits the page background (no card surface). */
.section-group--collapsible {
 display: block;
 margin: var(--space-5) 0 var(--space-1);
 background: transparent;
}

/* Strip ion-accordion's default card/item chrome. It exposes only shadow parts
 (no CSS custom properties), so ::part is the sanctioned hook for background;
 the header is an internal ion-item whose row chrome is zeroed via item CSS
 vars (divider, ripple, inset padding, min-height). */
.section-group--collapsible ion-accordion {
 background: transparent;
 /* Ionic sets :host{overflow:hidden} on the accordion purely to protect a
 border-radius/stacking context during the animation. We stripped the
 radius, so that host clip does nothing but shear the section-card
 box-shadow at the edges — and it re-clips the negative margin below. Let
 the host show overflow: the collapse animation is clipped independently by
 #content (part=content) via max-height + its own overflow:hidden, so the
 fold still works. */
 overflow: visible;
}
.section-group--collapsible ion-accordion::part(header),
.section-group--collapsible ion-accordion::part(content) {
 background: transparent;
}
/* The content region is clipped (overflow:hidden) so ion-accordion can animate
 its height. That shears the section-card box-shadow at the left/right edges
 (the left is masked by the accent stripe, so only the right reads as "cut
 off"). Pad the region by the shadow's spread, then pull it back out with an
 equal negative margin so the cards stay aligned with the eyebrow above. Only
 horizontal — vertical padding would offset the height animation. */
.section-group--collapsible ion-accordion::part(content) {
 padding-inline: var(--space-3);
 margin-inline: -12px;
}
.section-group--collapsible ion-item {
 --background: transparent;
 --background-hover: transparent;
 --background-activated: transparent;
 --background-focused: transparent;
 --border-width: 0; /* kill the MD/iOS row divider */
 --inner-border-width: 0;
 --padding-start: 0;
 --inner-padding-end: 0;
 --min-height: auto;
 --ripple-color: transparent; /* no MD ripple */
 width: 100%;
}
/* Let our header row own the full width inside the item's content area (ion-item
 lays default-slot content in a flex track; stretch it so the spacer can push
 the badge/chevron to the right edge). */
.section-group-header-item::part(native) {
 padding: 0;
}
/* Ionic's built-in disclosure chevron (auto-rotates with the accordion's real
 state). Tint it like the eyebrow, primary when active, with a little breathing
 room from the badge. */
.section-group--collapsible .ion-accordion-toggle-icon {
 color: var(--ion-color-medium);
 font-size: 1.1rem;
 margin-inline-start: 0.5rem;
}
.section-group--active .ion-accordion-toggle-icon {
 color: var(--ion-color-primary);
}

/* Header row — mirrors the old .section-collapsible-heading flexbox. */
.section-group-header {
 display: flex;
 align-items: center;
 gap: var(--space-2);
 width: 100%;
 padding: var(--space-1) 0;
 text-align: left;
}

/* Title + subtitle stack on the left. */
.section-group-heading-block {
 flex: 0 0 auto;
 display: flex;
 flex-direction: column;
 gap: 0.1rem;
}
.section-group-header .section-group-subtitle {
 margin: 0;
}

.section-group--active .section-group-label {
 color: var(--ion-color-primary);
}

.section-group-label {
 flex: 0 0 auto;
}

.section-group-badge {
 flex: 0 0 auto;
 padding: 0.05rem var(--space-2);
 border-radius: var(--radius-pill);
 background: var(--ion-color-primary);
 color: var(--ion-color-primary-contrast);
 font-size: 0.6rem;
 letter-spacing: 0.04em;
}

/* Flexible middle — grows to fill the row so the badge (and the built-in toggle
 icon after it) stay pinned right whether or not a summary is present. Clips a
 long preview. */
.section-group-spacer {
 flex: 1 1 auto;
 min-width: 0;
 overflow: hidden;
}

/* Collapsed preview line — normal case (not the eyebrow uppercase), muted,
 truncates so it never pushes the badge/chevron off-row. */
.section-group-summary {
 display: block;
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
 text-transform: none;
 letter-spacing: normal;
 font-weight: var(--weight-normal);
 font-size: var(--text-xs);
 color: var(--ion-color-medium);
}

/* Body flush with the eyebrow (Ionic pads the content region on iOS; zero it to
 match the old v-show div). */
/* The body wrapper is a plain light-DOM div, so it can carry the vertical
   breathing room the clipped `::part(content)` cannot.
   The same clip that shears the cards' side shadows also shears the TOP shadow
   of the first card: `--card-shadow` is `0 2px 8px`, so it reaches ~6px above
   the card, and the content region starts flush with it. Vertical padding on
   the PART is out (it offsets the height animation — see above), but padding
   here is inside the animated box and simply moves with it. */
.section-group-body {
  padding: 0;
  padding-block-start: 8px;
}
</style>
