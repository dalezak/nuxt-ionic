import { toastController } from '@ionic/vue';

// Tells the user when the device has no connection, app-wide, with no per-app
// wiring — every app extending this layer gets it by extending the layer.
//
// An Ionic toast rather than a banner component, for the usual reason: a toast
// already handles safe areas, the iOS/MD split, enter/exit animation and screen
// readers, and it needs no mount point in each app's `app.vue`. `duration: 0`
// makes it persistent — it stays until connectivity returns or the user
// dismisses it.
//
// It deliberately does NOT go through `showToast`. That helper runs a
// single-slot queue with a fixed 3s duration, so a permanent toast would sit in
// the only slot forever and silently swallow every other message in the app.
// This one talks to `toastController` directly and so lives outside that queue.
//
// Copy is plain and promises nothing: we cannot say the user's writing is safe
// (a save while offline fails like anything else), so we say what is true and
// let them decide what to do about it.
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const { online } = useOnline();
  let toast = null;
  let presenting = false;   // guards the await gap against a fast flap
  let announced = false;    // only say "back online" to someone who was told they were off

  nuxtApp.hook('app:mounted', () => {
    watch(online, async (isOnline) => {
      if (isOnline) {
        const had = toast;
        toast = null;
        try { await had?.dismiss(); } catch { /* already gone */ }
        if (announced) {
          announced = false;
          showToast('Back online', 'cloudDoneOutline', 'success');
        }
        return;
      }
      if (toast || presenting) return;
      presenting = true;
      try {
        const created = await toastController.create({
          message: "You're offline. Some things won't load or save until you're back.",
          duration: 0,
          position: 'top',
          color: 'warning',
          icon: getIcon('cloudOfflineOutline'),
          // Dismissible on purpose: a persistent bar the user cannot close is
          // its own small hostage situation. Dismissing does not re-present —
          // the watcher only fires on a CHANGE, so it stays gone until
          // connectivity actually moves.
          buttons: [{ text: 'Dismiss', role: 'cancel' }],
        });
        created.addEventListener('didDismiss', () => {
          if (toast === created) toast = null;
        });
        // Re-check: connectivity may have returned during the await above, in
        // which case the watcher already ran its online branch and there is
        // nothing to dismiss.
        if (online.value) return;
        toast = created;
        announced = true;
        await created.present();
      } catch (error) {
        consoleError('offline-notice plugin', error);
      } finally {
        presenting = false;
      }
    },
    // `immediate` because the app can BOOT offline. `useOnline()` binds and
    // reads `navigator.onLine` synchronously in the plugin body above, so by
    // the time this runs the ref already holds the truth — without immediate,
    // a cold start with no connection would never fire a change and the user
    // would get a silently broken app. On a normal online boot it runs the
    // online branch, which with no toast and nothing announced does nothing.
    { immediate: true });
  });
});
