// Health-store writes — generic primitive over Apple HealthKit (iOS) and
// Health Connect (Android). The consuming app decides WHAT gets logged and
// whether the user opted in; this only knows how to hand a session to the
// platform safely.
//
//   const { writeMindfulSession } = useHealth();
//   await writeMindfulSession({ seconds: 600 });
//
// `enabled` is an optional ref/computed. When present and false every write
// no-ops — so an app-level setting can switch the sync off without each
// caller re-checking it.
//
// The native plugin is INJECTED by the consuming app, not imported here — the
// same rule (and the same two failed attempts) documented on useAppBadge:
// a literal import in the layer makes the dependency mandatory for every
// consuming app, and an opaque dynamic import fixes the build while leaving
// the module unbundled, so it fails silently on device. Apps that want health
// sync register the plugin in their own Nuxt plugin
// (`provide: { healthPlugin: Health }`), where a static import puts it in that
// app's bundle. Apps that don't get a no-op.
//
// PLATFORM CAVEATS worth knowing before trusting this:
//   • Native only. There is no health store in a browser, so web/PWA is
//     always a no-op — not a bug to chase.
//   • iOS needs the HealthKit capability + NSHealthUpdateUsageDescription,
//     or the call throws at runtime with no build-time warning.
//   • Android needs Health Connect, which ships in the OS only on Android
//     14+. Below that the user must install it from the Play Store, so
//     isAvailable() can legitimately be false on a supported device.
//   • A denied permission is indistinguishable from a successful write that
//     the user later revoked. Never report "synced" in the UI on the strength
//     of this resolving.
//
// Nothing here throws. A health-store write is the least important thing
// attached to a completed session and must never take the surface down with
// it — least of all after the user has just finished something.
function loadPlugin() {
  try {
    return useNuxtApp()?.$healthPlugin ?? null;
  } catch {
    return null;   // outside a Nuxt context
  }
}

export function useHealth({ enabled = null } = {}) {
  const isEnabled = () => (enabled ? !!enabled.value : true);

  // Whether a health store exists to write to. Distinct from permission:
  // available + denied is the normal state before the user has ever been
  // asked.
  async function isAvailable() {
    if (!import.meta.client || !isEnabled()) return false;
    const plugin = loadPlugin();
    if (!plugin) return false;
    try {
      const result = await plugin.isAvailable();
      return !!result?.available;
    } catch (error) {
      consoleError('useHealth.isAvailable', error);
      return false;
    }
  }

  // Permission is requested lazily, on the first real write — asking on app
  // boot, before the user has done anything worth logging, is a poor trade and
  // reads as a data grab. The OS shows its sheet once; later calls resolve
  // from the stored answer, so this is cheap to call every time.
  //
  // Write scope only. Nothing here reads the user's health data, and asking
  // for read access we never use would widen the permission sheet for no
  // reason — and put the app in a worse position at App Store review.
  async function ensureAuthorized(plugin, dataType) {
    try {
      const status = await plugin.requestAuthorization({ write: [dataType] });
      return !!status?.writeAuthorized?.includes(dataType);
    } catch (error) {
      consoleError('useHealth.ensureAuthorized', error);
      return false;
    }
  }

  // Log a completed mindfulness session — Apple Health's "Mindful Minutes",
  // Health Connect's MindfulnessSession.
  //
  // Both platforms store this as an INTERVAL and derive the duration from it
  // (iOS builds an HKCategorySample whose value is a constant 0; the `value` /
  // `unit` below are carried only because the plugin's signature requires
  // them). So the start and end dates are the entire payload — passing a
  // wrong or zero-length interval logs a wrong or zero-length session, however
  // right `seconds` looks.
  //
  // Pass the seconds ACTUALLY sat, not the session's nominal length.
  async function writeMindfulSession({ seconds, endedAt = null } = {}) {
    if (!import.meta.client || !isEnabled()) return false;
    const secs = Math.round(Number(seconds) || 0);
    // A zero/negative interval is not a session. Health Connect rejects it
    // outright and HealthKit accepts it as an empty blip in the user's day.
    if (secs <= 0) return false;

    const plugin = loadPlugin();
    if (!plugin) return false;

    try {
      if (!(await plugin.isAvailable())?.available) return false;
      if (!(await ensureAuthorized(plugin, 'mindfulness'))) return false;

      const end = endedAt ? new Date(endedAt) : new Date();
      const start = new Date(end.getTime() - (secs * 1000));
      await plugin.saveSample({
        dataType: 'mindfulness',
        value: secs / 60,
        unit: 'minute',
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        mindfulnessSessionType: 'meditation',   // Android only; iOS has no session types
      });
      return true;
    } catch (error) {
      consoleError('useHealth.writeMindfulSession', error);
      return false;
    }
  }

  return { isAvailable, writeMindfulSession };
}
