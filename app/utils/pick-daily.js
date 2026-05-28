import { DAY_MS } from '#layers/nuxt-supabase/app/utils/time';

// Pick one item from an array, deterministic per UTC day. Returns the same
// item to every caller on the same calendar day; rotates as the day rolls
// over. Cheap, stable, and doesn't need a per-user seed — useful for daily
// quotes / prompts / challenges / practices that should be consistent
// within a day but vary across days.
//
//   pickDaily(DAILY_PROMPTS)              // → one prompt, same all day
//   pickDaily(state.practices)            // → one practice, same all day
//   pickDaily(candidates) ?? fallback     // → null when array is empty
//
// Returns null for empty/missing input so callers can use it inside
// computeds without guarding length first.

export default function pickDaily(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const dayOfEpoch = Math.floor(Date.now() / DAY_MS);
  return items[dayOfEpoch % items.length];
}
