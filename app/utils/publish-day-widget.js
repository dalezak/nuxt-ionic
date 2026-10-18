import { useWidget } from '../composables/use-widget';

// The day's steps, published to the home-screen "day widget".
//
//   publishDayWidget({
//     steps: [{ id: 'commit', title: 'Commit', done: true }, …],
//     next:  { title: 'Practice', detail: 'Notice One Bid' },   // or null
//   });
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

export default async function publishDayWidget({ steps = [], next = null } = {}) {
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
    // Stamped so the widget can tell a stale payload from today's — WidgetKit
    // honours reloads on its own budget, and yesterday's day shown as today's
    // is worse than an admitted date.
    day: today(),
  });
}

// The device's local calendar day, YYYY-MM-DD — the same day the user sees.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
