// Pick one phrasing from a list of interchangeable ones, by position.
//
// For copy that repeats down a list of similar items — a per-rating rationale
// on a multi-step walk, a per-status caption in a feed — where a single fixed
// sentence would render identically two or three rows running. Repetition
// trains the eye to skip: once a line is recognised as boilerplate it stops
// being READ, and a sentence whose whole job is to sound like the app noticed
// something is exactly the one that mustn't become chrome.
//
//   pickVariant(WHY_BY_SCORE[score - 1], stepIndex)
//
// ## Why an index and not Math.random()
//
// Two reasons, both practical:
//
//  1. **Stability.** A computed that rolls a die re-rolls on every re-render,
//     so the sentence changes under the user while they interact with the
//     screen, and again when they navigate back to it.
//  2. **Randomness repeats.** Three variants picked at random still collide
//     about a third of the time — precisely the case this exists to prevent.
//
// An index also buys a guarantee when the list is SORTED by whatever selects
// the variant list (e.g. a walk ordered by rating, where same-rated items are
// necessarily adjacent): consecutive positions can't land on the same variant,
// so the collisions that would actually be noticed are impossible rather than
// merely unlikely.
//
// With N variants, adjacent repetition is impossible for runs shorter than
// N + 1; beyond that the cycle repeats every N, never side by side.
//
// Returns null for an empty/missing list so callers can use it in a computed
// without guarding length first.
export default function pickVariant(variants, index = 0) {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  // Floor + abs so a fractional or negative index can't produce undefined.
  const i = Math.abs(Math.floor(index)) % variants.length;
  return variants[i];
}
