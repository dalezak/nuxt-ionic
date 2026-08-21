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

