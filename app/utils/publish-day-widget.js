import { useWidget } from '../composables/use-widget';

// The day's steps, published to the home-screen "day widget".
//
//   publishDayWidget({
//     steps: [{ id: 'commit', title: 'Commit', done: true }, …],
//     next:  { title: 'Practice', detail: 'Notice One Bid' },   // or null
//     rings: [{ value: 1, color: 'beat-dawn', title: 'Commit' }, …],  // optional
//   });
//
// `rings` is TODAY's <weekly-rings> mark: the same `{ value: 0..1, color }`
// channels, centre first. The widget draws it as a dot plus concentric arcs
// beside the steps, and as the lock screen's circular family. Omit it and the
// widget draws exactly what it did before. One day only, never the week: a
// row of seven marks on a surface the user cannot close reads as a streak.
// `color` is an Ionic palette name (or a hex); it is resolved to hex here,
// because the widget is another process and cannot read CSS variables.
//
// Pairs with `native/ios/DayWidget.swift`, which every app copies in unchanged
// (`npm run widget:copy`). The payload below IS the contract between the two —
// the widget is a separate process and can read nothing else — so a field
// renamed here has to be renamed there in the same change.
//
// Per-app settings come from app.config, so the publisher and the Swift stay
// identical across apps:
//
//   widget: {
//     group: 'group.com.example.app',   // App Group shared with the extension
//     label: "Today's Path",            // header, when it fits
//     shortLabel: 'Today',              // header, in the small family
//     url: 'example://today',           // where a tap lands (see useDeepLinks)
//     doneHeadline: 'Your day is complete.',
//     emptyHeadline: 'Nothing set yet today.',
//   }
//
// ── WHAT IS DELIBERATELY NOT ON IT ───────────────────────────────────────────
// No streak, no "days since", no percentage. A home screen is the most
// persistent surface an app has and the user cannot close it, so progress is
// scoped to ONE day ("2 of 4") and resets by morning, and a finished day reads
// as a close, not a score. Keep it that way in any app that adopts this.
//
// PRIVACY: the small and lock-screen families are read by anyone glancing at
// the phone. `title` / `detail` must be the app's own vocabulary (a step name,
// a practice title) — never text the user wrote.
//
// Fire-and-forget like `useWidget().publish`: resolves false (never throws)
// when the app has no widget config, no bridge, or is running on the web.
export const DAY_WIDGET_KEY = 'day';

export default async function publishDayWidget({ steps = [], next = null, rings = null } = {}) {
  const config = useAppConfig().widget ?? {};
  if (!config.group) return false;

  const { publish } = useWidget({ group: config.group });
  const doneCount = steps.filter(s => s.done).length;
  return publish(DAY_WIDGET_KEY, {
    label: config.label ?? 'Today',
    shortLabel: config.shortLabel ?? config.label ?? 'Today',
    url: config.url ?? null,
    // In order, with their tick state — the widget draws these as a row of
    // dots (small) or named ticks (medium), so the day's shape reads at a
    // glance without reading.
    steps: steps.map(s => ({ id: s.id, title: s.title, done: !!s.done })),
    // The next thing still open, named as specifically as the app can.
    nextTitle: next?.title ?? null,
    nextDetail: next?.detail ?? null,
    headline: next
      ? (next.detail ?? next.title)
      : (doneCount ? (config.doneHeadline ?? 'Your day is complete.') : (config.emptyHeadline ?? 'Nothing set yet today.')),
    doneCount,
    total: steps.length,
    rings: Array.isArray(rings) && rings.length
      ? rings.map(r => ({
        value: clamp01(Number(r?.value)),
        color: resolveColor(r?.color),
        title: r?.title ?? null,
      }))
      : null,
    // Stamped so the widget can tell a stale payload from today's — WidgetKit
    // honours reloads on its own budget, and yesterday's day shown as today's
    // is worse than an admitted date.
    day: today(),
  });
}

function clamp01(n) {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

// An Ionic palette name → its current hex (`--ion-color-<name>`); a hex passes
// through. Null when it can't be resolved, and the widget falls back to its
// accent colour. Read from the live theme, so it follows the app's own mode —
// from <body>, not <html>: dark palettes are scoped to `body.dark`, and :root
// alone would hand the widget the light values in dark mode.
function resolveColor(color) {
  if (!color) return null;
  if (String(color).startsWith('#')) return color;
  if (typeof document === 'undefined') return null;
  const value = getComputedStyle(document.body ?? document.documentElement)
    .getPropertyValue(`--ion-color-${color}`).trim();
  return value.startsWith('#') ? value : null;
}

// The device's local calendar day, YYYY-MM-DD — the same day the user sees.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
