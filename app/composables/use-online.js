// Reactive connectivity, shared across every caller.
//
// `navigator.onLine` plus the window `online` / `offline` events. No Capacitor
// plugin: `@capacitor/network` would give a richer answer (cellular vs wifi),
// but it is a native dependency to install and sync in every app for a question
// the WebView already answers, and the answer we need here is binary.
//
// The honest limit, worth knowing before you build on this: `navigator.onLine`
// reports whether the device has a network INTERFACE, not whether the internet
// is reachable. Connected to a wifi network with no route out, it stays true.
// So treat `offline === true` as reliable ("there is definitely no connection")
// and `online === true` as merely probable. Surfaces should still handle a
// failed request; this is for telling the user what is already obvious to them,
// not for deciding whether a request is worth making.
//
// The listeners bind once at module scope — the ref is a singleton, so a
// hundred components calling this share one pair of listeners. Defaults to
// `true` on the server so SSR never renders offline chrome and hydration has
// nothing to disagree about.

const online = ref(true);
let bound = false;

function bind() {
  if (bound || !import.meta.client) return;
  bound = true;
  online.value = window.navigator.onLine !== false;
  window.addEventListener('online', () => { online.value = true; });
  window.addEventListener('offline', () => { online.value = false; });
}

export function useOnline() {
  bind();
  return {
    online,
    offline: computed(() => !online.value),
  };
}
