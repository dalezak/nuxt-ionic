<!--
  PricingPlanCard — one column in a public /plans grid. Renders the plan
  label, price (or "Free"), optional annual price, description, a feature
  list, and a primary CTA. Built on <section-card>: the price stack rides the
  #header escape hatch (it isn't the standard icon/title row), the description
  + features fill the body, and the CTA sits in #footer. Card chrome
  (radius, padding, shadow) is token-driven via card-tokens.css.

  App-agnostic by design — the feature ROWS are app-specific (every app gates
  different entitlements with different copy), so the host passes them as a
  `features` data array rather than the component hardcoding any. The
  "recommended" treatment (solid CTA + glow border) is driven by a `highlight`
  prop, not a baked-in plan id.

  Usage:
    <pricing-plan-card
      :plan="plan"
      :features="featuresFor(plan)"
      :highlight="plan.id === 'pro'"
      @select="onSelect" />

  where featuresFor returns [{ icon, color?, label, disabled? }]. The host owns
  per-row icon/color resolution (e.g. a swap to a close-circle + medium for a
  gated-off row), so the card stays purely presentational.
-->

<template>
  <section-card :class="['plan-card', `plan-${plan.id}`, { 'plan-highlight': highlight }]">
    <!-- Custom price-stack header — label + price + annual line. Uses the
         #header escape hatch since it's not section-card's icon/title row. -->
    <template #header>
      <ion-note class="plan-label">{{ plan.label }}</ion-note>
      <div class="plan-price">
        <span v-if="plan.price === 0" class="price-amount">Free</span>
        <template v-else>
          <span class="price-currency">$</span>
          <span class="price-amount">{{ plan.price }}</span>
          <span class="price-period">/mo</span>
        </template>
      </div>
      <p v-if="plan.annual_price > 0" class="plan-annual">
        or ${{ plan.annual_price }}/year
      </p>
    </template>

    <p class="plan-description">{{ plan.description }}</p>

    <ion-list lines="none" class="feature-list">
      <ion-item
        v-for="(feature, i) in features"
        :key="i"
        :class="{ disabled: feature.disabled }">
        <ion-icon :icon="feature.icon" :color="feature.color ?? 'primary'" slot="start" />
        <ion-label>{{ feature.label }}</ion-label>
      </ion-item>
    </ion-list>

    <template #footer>
      <!-- The user's current plan on a manage/subscribe surface — a quiet,
           non-actionable marker instead of a "choose" CTA. -->
      <ion-button size="small"
        v-if="current"
        expand="block"
        fill="clear"
        color="medium"
        disabled>
        <ion-icon :icon="checkmarkCircle" slot="start" />
        Current plan
      </ion-button>
      <ion-button size="small"
        v-else
        expand="block"
        :fill="highlight ? 'solid' : 'outline'"
        @click="$emit('select', plan)">
        {{ ctaLabel ?? (plan.price === 0 ? 'Get started' : `Choose ${plan.label}`) }}
      </ion-button>
    </template>
  </section-card>
</template>

<script setup>
import { checkmarkCircle } from 'ionicons/icons';
defineProps({
  // One entry from app.config `plans`. Chrome keys: id, label, price,
  // annual_price, description. (Entitlement keys are the host's business —
  // it reads them in featuresFor, not here.)
  plan: { type: Object, required: true },
  // [{ icon, color?, label, disabled? }] — host-resolved feature rows.
  features: { type: Array, default: () => [] },
  // Recommended plan: solid CTA + glow border (vs outline CTA, plain border).
  highlight: { type: Boolean, default: false },
  // The user's current plan (manage/subscribe surface) — swaps the CTA for a
  // quiet "Current plan" marker and suppresses `select`.
  current: { type: Boolean, default: false },
  // Override the CTA label (e.g. "Upgrade to Companion" on the subscribe page).
  // Falls back to the public "Get started" / "Choose {label}" wording.
  ctaLabel: { type: String, default: null },
});

defineEmits(['select']);
</script>

