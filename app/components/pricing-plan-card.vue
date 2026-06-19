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
      <ion-button
        expand="block"
        :fill="highlight ? 'solid' : 'outline'"
        @click="$emit('select', plan)">
        {{ plan.price === 0 ? 'Get started' : `Choose ${plan.label}` }}
      </ion-button>
    </template>
  </section-card>
</template>

<script setup>
defineProps({
  // One entry from app.config `plans`. Chrome keys: id, label, price,
  // annual_price, description. (Entitlement keys are the host's business —
  // it reads them in featuresFor, not here.)
  plan: { type: Object, required: true },
  // [{ icon, color?, label, disabled? }] — host-resolved feature rows.
  features: { type: Array, default: () => [] },
  // Recommended plan: solid CTA + glow border (vs outline CTA, plain border).
  highlight: { type: Boolean, default: false },
});

defineEmits(['select']);
</script>

<style scoped>
/* Card chrome comes from <section-card> + card-tokens.css. Local rules are
   only: zero the Ionic default margin so the card fills its flex item, and
   the highlighted-plan variant. (Width comes from the parent /plans layout.) */
.plan-card {
  margin: 0;
}

/* Highlighted "recommended" plan — full border + soft glow. A variant
   highlight, not generic chrome, so it stays here rather than in tokens. */
.plan-highlight {
  border: 1.5px solid var(--ion-color-primary);
  box-shadow: 0 2px 16px rgba(var(--ion-color-primary-rgb), 0.12);
}

.plan-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.4rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.1rem;
  margin-bottom: 0.2rem;
}

.price-currency {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.7;
}

.price-amount {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
  color: var(--ion-color-dark);
}

.price-period {
  font-size: 0.85rem;
  opacity: 0.5;
  margin-left: 0.1rem;
}

.plan-annual {
  font-size: 0.8rem;
  opacity: 0.5;
  margin: 0 0 0.5rem;
}

.plan-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--ion-color-medium-shade);
  margin: 0 0 1rem;
}

.feature-list {
  --background: transparent;
}

:deep(.feature-list.list-md),
:deep(.feature-list.list-ios) {
  background: transparent;
}

.feature-list ion-item {
  --background: transparent;
  --padding-start: 0.5rem;
  --inner-padding-start: 0;
  --min-height: 2.2rem;
  font-size: 0.9rem;
}

.feature-list ion-item.disabled {
  opacity: 0.4;
}

.feature-list ion-item ion-icon {
  margin-inline-end: 0.4rem;
  font-size: 1.05rem;
}
</style>
