// App-icon badge — generic primitive. The consuming app decides WHAT the number
// counts and whether the user has opted in; this only knows how to put a number
// on the icon safely.
//
//   const { setBadge, clearBadge } = useAppBadge({ enabled: settingRef });
//
// `enabled` is an optional ref/computed. When it is present and false,
// `setBadge` clears instead of setting — so turning the setting off removes an
// existing badge rather than freezing it.
//
// Editorial guidance for callers, learned in love-well: count a BOUNDED set
// (the day's beats), never an open-ended backlog. A badge over a to-do pile
// grows with engagement, so the more committed the user, the bigger their debt
// number — which is the guilt loop both apps' CLAUDE.md rule out.
//
// Three back-ends, tried in order, all optional:
//   1. A native badge plugin the APP provides as `$appBadgePlugin` (see the
//      note on loadPlugin below for why it is injected rather than imported).
//   2. navigator.setAppBadge — the Web Badging API. Works on installed PWAs
//      (Chrome/Edge, and iOS 16.4+ once added to the home screen). NOT
//      available inside a Capacitor WKWebView.
//   3. no-op.
//
// PLATFORM CAVEATS worth knowing before trusting this:
//   • iOS requires notification permission INCLUDING the badge option. A user
//     who declined notifications gets no badge at all.
//   • Android badge counts are launcher-dependent. Samsung/OnePlus render the
//     number; Pixel and stock Android show only a dot tied to an active
//     notification. Setting 3 there does not display 3.
//
// Nothing here throws. A badge is the least important thing on the device and
// must never take a page down with it.

// The native plugin is INJECTED by the consuming app, not imported here.
//
// Two failed approaches before this one, both worth recording:
//
//   1. `await import('@capawesome/capacitor-badge')` — the bundler resolves the
//      literal at BUILD time, so any app extending this layer without the
//      plugin installed fails its build outright ("Rolldown failed to resolve
//      import"). The dependency was effectively mandatory.
//   2. The same import with an opaque specifier + @vite-ignore — that fixed the
//      build and broke the runtime: the module is no longer bundled, so on
//      device the import fails, we fall through to `navigator.setAppBadge`,
//      which does not exist in WKWebView. Perfectly silent, no badge.
//
// So each app that wants native badges registers the plugin in its own Nuxt
// plugin (`provide: { appBadgePlugin: Badge }`), where a static import puts it
// in that app's bundle. The layer stays dependency-free, apps without it get
// the Badging API or a no-op, and the whole thing works on device.
function loadPlugin() {
  try {
    return useNuxtApp()?.$appBadgePlugin ?? null;
  } catch {
    return null;   // outside a Nuxt context
  }
}

export function useAppBadge({ enabled = null } = {}) {
  // No `enabled` passed → always on. An app that wants a user toggle passes its
  // own setting ref.
  const isEnabled = () => (enabled ? !!enabled.value : true);

  // Permission is requested lazily, on the first real set — asking on app boot
  // for a badge nobody has seen yet is a poor trade.
  async function ensurePermission(plugin) {
    try {
      const { display } = await plugin.checkPermissions();
      if (display === 'granted') return true;
      const res = await plugin.requestPermissions();
      return res?.display === 'granted';
    } catch {
      return false;
    }
  }

  async function setBadge(count) {
    if (!import.meta.client) return;
    // Respect the user's setting — when off, make sure nothing is left behind.
    if (!isEnabled()) return clearBadge();

    const n = Math.max(0, Number(count) || 0);
    try {
      const plugin = loadPlugin();
      if (plugin) {
        if (n === 0) return void await plugin.clear();
        if (!(await ensurePermission(plugin))) return;
        return void await plugin.set({ count: n });
      }
      if (typeof navigator !== 'undefined' && navigator.setAppBadge) {
        return void (n === 0 ? await navigator.clearAppBadge() : await navigator.setAppBadge(n));
      }
    } catch (error) {
      consoleError('useAppBadge.setBadge', error);
    }
  }

  async function clearBadge() {
    if (!import.meta.client) return;
    try {
      const plugin = loadPlugin();
      if (plugin) return void await plugin.clear();
      if (typeof navigator !== 'undefined' && navigator.clearAppBadge) {
        return void await navigator.clearAppBadge();
      }
    } catch (error) {
      consoleError('useAppBadge.clearBadge', error);
    }
  }

  // Bind the badge to a reactive count for the lifetime of the calling page.
  // Every consumer of this needs the same three behaviours, and getting any of
  // them wrong is silent:
  //
  //   • follow the count as it changes, so no individual handler has to
  //     remember the badge exists;
  //   • NOT write before the data has loaded — a page's "open items" computed
  //     usually reads as fully-open before its first fetch, so an eager write
  //     puts up a number that means "we have not looked yet";
  //   • re-assert on background, which is both when the badge is actually seen
  //     and the last moment anything of ours runs.
  //
  // Call from setup(). Registers and tears down its own listener.
  //
  //   useBadgeForCount(openBeats, { ready: () => !state.loading })
  function useBadgeForCount(count, { ready = null } = {}) {
    const isReady = () => (ready ? !!ready() : true);

    // `enabled` is a watch SOURCE, not just a gate inside setBadge. Without it,
    // turning the setting on did nothing visible until the count happened to
    // change — the user flips the toggle, goes back to the home screen, and
    // sees no badge, which reads as broken. Watching it means switching on
    // writes the current count immediately and switching off clears at once.
    //
    // `immediate` so a page that mounts with the setting already on gets the
    // badge without waiting for a change; `isReady()` is what stops it writing
    // a pre-load count.
    watch(
      [() => toValue(count), () => isReady(), () => (enabled ? !!enabled.value : true)],
      ([n, ok]) => { if (ok) setBadge(n); },
      { immediate: true },
    );

    onMounted(async () => {
      if (!import.meta.client) return;
      try {
        const { App } = await import('@capacitor/app');
        const handle = await App.addListener('pause', () => {
          if (isReady()) setBadge(toValue(count));
        });
        onUnmounted(() => handle?.remove?.());
      } catch {
        // Web build, or @capacitor/app absent — the watcher still covers it.
      }
    });
  }

  return { setBadge, clearBadge, useBadgeForCount };
}
