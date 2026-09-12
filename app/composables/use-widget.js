// Home-screen widgets — generic primitive over iOS WidgetKit and Android app
// widgets. The consuming app decides WHAT the widget says; this only knows how
// to hand a payload across the process boundary and ask the OS to redraw.
//
//   const { publish } = useWidget({ group: 'group.co.lovewell' });
//   await publish('today', { title: 'Own the Morning', body: '…' });
//
// ── WHY A WIDGET IS NOT JUST ANOTHER SURFACE ─────────────────────────────────
// A widget runs in a SEPARATE PROCESS with no access to the webview, the DOM,
// the theme tokens, or any store. Nothing here renders anything — the view is
// native (SwiftUI on iOS), and all this layer can do is put values in a shared
// container the extension can read. Treat `publish` as writing to a mailbox:
// fire-and-forget, no guarantee anyone reads it soon, no way to read the UI
// back.
//
// The native plugin is INJECTED by the consuming app, not imported — the same
// rule (and the same two failed attempts) documented on useAppBadge and
// useHealth. Apps that want widgets register it in their own Nuxt plugin
// (`provide: { widgetPlugin: WidgetBridge }`); apps that don't get a no-op.
//
// PLATFORM CAVEATS worth knowing before trusting this:
//   • Native only. There is no home screen in a browser, so web is a no-op.
//   • iOS needs the App Group entitlement on BOTH the app target and the
//     widget extension, allowlisted in the provisioning profile. Without it,
//     writes succeed into a container the widget cannot see — the worst
//     failure mode here, because nothing errors.
//   • Refresh is BUDGETED, not immediate. `reloadAllTimelines` is a request;
//     WidgetKit decides when to honour it. Never promise the user a live view.
//   • Values must survive JSON — the bridge stores strings.
//
// Nothing throws. A stale widget is a small disappointment; a crashed page is
// not.
function loadPlugin() {
  try {
    return useNuxtApp()?.$widgetPlugin ?? null;
  } catch {
    return null;   // outside a Nuxt context
  }
}

export function useWidget({ group = null, enabled = null } = {}) {
  const isEnabled = () => (enabled ? !!enabled.value : true);

  // Write one payload and ask for a redraw. `key` is the shared-defaults key
  // the native view reads; `payload` is any JSON-serialisable object.
  //
  // Returns true only when the write AND the reload both went through, so a
  // caller can log a miss — but callers should not gate UI on it.
  async function publish(key, payload) {
    if (!import.meta.client || !isEnabled() || !group || !key) return false;
    const plugin = loadPlugin();
    if (!plugin) return false;
    try {
      await plugin.setItem({ key, group, value: JSON.stringify(payload ?? null) });
      // Kind-specific reloads exist (`reloadTimelines({ ofKind })`) but the
      // app rarely knows which kinds the user has actually placed, and asking
      // for all of them costs the same budget.
      await plugin.reloadAllTimelines();
      return true;
    } catch (error) {
      consoleError('useWidget.publish', error);
      return false;
    }
  }

  // Clear a payload — for sign-out, or a surface that should stop showing
  // something private once it is no longer true.
  async function clear(key) {
    if (!import.meta.client || !group || !key) return false;
    const plugin = loadPlugin();
    if (!plugin) return false;
    try {
      await plugin.removeItem({ key, group });
      await plugin.reloadAllTimelines();
      return true;
    } catch (error) {
      consoleError('useWidget.clear', error);
      return false;
    }
  }

  return { publish, clear };
}
