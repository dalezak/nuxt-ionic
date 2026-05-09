// useSubscription — base subscription state + gating helpers.
//
// Reads `subscription_status` from the auth user's profile and resolves it
// against the consuming app's `plans` array in app.config.ts. The plans
// array's `id` values must match the categorical `subscription_status`
// values in the layer's users table (`'free'`, `'standard'`, `'premium'`)
// — re-skin via `plans[].label` rather than changing the categorical IDs.
//
// Apps that need domain-specific gating (e.g. "can the user create another
// course?", which requires a count query) wrap this composable in their
// own and add their async helpers there. The base composable stays sync
// + side-effect-free except for `requiresPaid`, which is a UI affordance.

export function useSubscription() {
  const { profile } = useProfile();
  const { plans } = useAppConfig();

  const currentPlan = computed(() => {
    const status = profile.value?.subscription_status ?? 'free';
    return plans?.find?.(p => p.id === status) ?? plans?.[0] ?? null;
  });

  const isPaid = computed(() => {
    const status = profile.value?.subscription_status;
    return status === 'standard' || status === 'premium';
  });

  const isPremium = computed(() => profile.value?.subscription_status === 'premium');

  const isFree = computed(() => !isPaid.value);

  const planLabel = computed(() => currentPlan.value?.label ?? 'Free');

  // Read any feature flag off the current plan. Apps store boolean / number
  // limits as columns on each plan object; this is a uniform accessor:
  //   canUseFeature('groups') → true/false
  //   featureLimit('habits')  → number | undefined
  function canUseFeature(key) {
    return Boolean(currentPlan.value?.[key]);
  }

  function featureLimit(key) {
    return currentPlan.value?.[key];
  }

  // Gate UI: returns true if user is paid; otherwise shows an upgrade
  // dialog and returns false. Caller pattern:
  //   if (!await requiresPaid('Groups')) return;
  async function requiresPaid(featureLabel = 'This feature') {
    if (isPaid.value) return true;
    await showConfirm(
      'Upgrade required',
      null,
      `${featureLabel} is available on a paid plan. Upgrade to unlock more.`,
      () => showPage('/subscribe'),
      'Upgrade',
      'Not now',
    );
    return false;
  }

  return {
    profile,
    plans,
    currentPlan,
    isPaid,
    isPremium,
    isFree,
    planLabel,
    canUseFeature,
    featureLimit,
    requiresPaid,
  };
}
