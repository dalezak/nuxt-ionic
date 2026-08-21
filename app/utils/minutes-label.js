// Format a duration in SECONDS as a short "N min" label (rounded, minimum 1
// min). Returns '' for a falsy/zero duration. Shared across the meditation +
// practice surfaces (and any timed content) so the label reads identically
// everywhere — auto-imported as `minutesLabel`.
export default function minutesLabel(seconds) {
  if (!seconds) return '';
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}
