// The canonical red→green ramp for a 5-point rating scale.
//
// <rating-scale> renders these as its pill colours, and surfaces that ECHO a
// rating back in prose ("You rated this Struggling — …") colour the rating word
// with the same value, so the word and the pill the user tapped always match.
//
// Lives in JS rather than CSS because it has two kinds of consumer. The scale
// binds it to a custom property; text echoes need the raw value for an inline
// style, and scoped component CSS can't be read from outside. Two apps had
// hand-copied these five hex values into their own constants before this
// existed — which meant tuning the gradient would have moved the pills while
// leaving every echo sentence quietly disagreeing with them.
//
//   RATING_COLORS[score - 1]   // direct, when you know it's a 1..5 score
//   ratingColor(score)         // null-safe, for template bindings
//
// A red→green ramp carries meaning by convention (bad → good), so don't reuse
// it for scales that aren't valenced — a 1..5 "how often" scale should not
// imply that "rarely" is a failure.
export const RATING_COLORS = ['#d33a3a', '#e07a3a', '#d9b13a', '#6fb04c', '#2fa84f'];

// The colour for a 1-based score, or null when it's out of range. Null rather
// than a fallback colour on purpose: scales longer than 5 have no defined ramp,
// and callers should fall through to their own neutral (the scale's CSS does
// this with `var(--pill-color, var(--ion-color-medium))`) rather than be handed
// an arbitrary green.
export default function ratingColor(score) {
  return RATING_COLORS[score - 1] ?? null;
}
