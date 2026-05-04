import Badge from '../../../nuxt-supabase/app/models/Badge';

// Generic badge-awarding composable. Wraps Badge.award() (data layer in
// nuxt-supabase) with toast feedback (UI in nuxt-ionic). Idempotent: if
// the user has already earned the badge, no toast fires; if just earned,
// a celebration toast appears.
//
// Apps build their own milestone-check functions on top — e.g.
//   const { awardBadge } = useBadges();
//   if (count >= 7) await awardBadge(userId, 'week_warrior');

export function useBadges() {

  async function awardBadge(userId, type) {
    if (!userId || !type) return null;
    const badge = await Badge.award(userId, type);
    if (badge) showToast(`Badge earned: ${badge.name}`, 3, getIcon('trophy'));
    return badge ?? null;
  }

  return { awardBadge };
}
