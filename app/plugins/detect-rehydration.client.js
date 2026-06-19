// detect-rehydration — flags when the page was COLD-BOOTED right after being
// backgrounded. On iOS Safari that almost always means the OS discarded the tab
// to reclaim memory and WebKit reloaded it from scratch (a full app reboot, not
// a foreground resume). There's no cross-browser API for this — Chromium's
// `document.wasDiscarded` and the Page Lifecycle freeze/resume events aren't
// implemented in WebKit — so we leave a breadcrumb in localStorage on
// `visibilitychange → hidden` and read it back at the next boot.
//
// Side-effect-free: it only sets `useState('rehydration')` and logs. It never
// reloads or navigates — apps decide what to do with the signal (report to
// Sentry, restore the lost route, quiet-refresh). A bfcache restore (instant,
// state intact) is logged separately and is NOT a rehydration.
//
//   useState('rehydration') → { rehydrated, navType, awayMs, lastRoute }

const KEY = 'app:lifecycle';
const MAX_AWAY_MS = 6 * 60 * 60 * 1000; // ignore stale breadcrumbs (> 6h away)

export default defineNuxtPlugin(() => {
  const rehydration = useState('rehydration', () => ({ rehydrated: false }));

  // Read (and consume) the breadcrumb the previous session left when it went
  // hidden. Consuming it means a later *manual* reload — with no fresh
  // backgrounding — won't be misread as a rehydration.
  let prior = null;
  try {
    prior = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (prior) localStorage.removeItem(KEY);
  } catch (_) { /* private mode / storage blocked */ }

  const navType = performance.getEntriesByType?.('navigation')?.[0]?.type ?? null;
  const awayMs = prior?.hiddenAt ? Date.now() - prior.hiddenAt : null;

  // CRUCIAL guard: a genuine iOS tab discard RELOADS the same URL (or, with a
  // service-worker navigateFallback, lands on the root '/'). A normal full-page
  // navigation — typing a new address — instead lands on a DIFFERENT url than
  // where the previous page went hidden. Without this check, every address-bar
  // load looks like a rehydration (the page we left wrote the breadcrumb), which
  // is a false positive. So only flag when we booted back onto the same path.
  const here = window.location.pathname;
  const wasPath = (prior?.route ?? '').split('?')[0];
  const looksLikeDiscard = !!wasPath && (here === wasPath || here === '/');

  if (awayMs != null && awayMs >= 0 && awayMs < MAX_AWAY_MS && looksLikeDiscard) {
    rehydration.value = { rehydrated: true, navType, awayMs, lastRoute: prior.route ?? null };
    consoleLog('rehydration detected', rehydration.value);
  }

  // Leave the breadcrumb for the NEXT boot: stamp the route + time on hide.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    try {
      localStorage.setItem(KEY, JSON.stringify({
        hiddenAt: Date.now(),
        route: useRouter().currentRoute.value.fullPath,
      }));
    } catch (_) { /* ignore */ }
  });

  // bfcache restore (back/forward, instant — state intact) is the GOOD return;
  // not a rehydration, just logged so the two are distinguishable.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) consoleLog('bfcache restore (no rehydrate)');
  });
});
