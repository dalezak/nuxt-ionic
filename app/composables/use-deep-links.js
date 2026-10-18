// Opens `<scheme>://…` links on the matching route — a home-screen widget's
// tap, a notification action, a link typed into Safari.
//
// The host + path become the route: `example://today` → `/today`,
// `example://practices/abc` → `/practices/abc`. Any app on the phone can open
// a custom-scheme link, so only a path the router actually resolves is
// followed; anything else is ignored and the app simply resumes.
//
// The scheme comes from app.config `deepLinks.scheme` and must also be
// registered natively (iOS: CFBundleURLTypes in the app's Info.plist).
//
// The native `App` plugin is INJECTED by the consuming app, not imported — the
// same rule as useWidget / useAppBadge / useHealth: the layer cannot import an
// optional native plugin without making it mandatory for every app. Each app
// registers it from a one-line plugin of its own:
//
//   // app/plugins/deep-links.client.js
//   import { App } from '@capacitor/app';
//   export default defineNuxtPlugin(() => { useDeepLinks(App); });
//
// iOS always opens the app on a widget tap, scheme or not — the link only
// decides where it LANDS. Without this the app resumes on its last screen.
//
// Warm opens only. A cold launch boots to the app's home route; a link deeper
// than a tab would also need `appPlugin.getLaunchUrl()` on boot.
export function useDeepLinks(appPlugin) {
  const { deepLinks, tabs = [] } = useAppConfig();
  const scheme = deepLinks?.scheme;
  if (!import.meta.client || !appPlugin || !scheme) return;

  const router = useRouter();
  appPlugin.addListener('appUrlOpen', ({ url }) => {
    try {
      const path = deepLinkPath(url, scheme);
      if (!path || !router.resolve(path).matched.length) return;
      // A tab switches like a tab-bar tap (drops the current stack); anything
      // deeper pushes onto it, so back returns to where the user was.
      const bare = path.split('?')[0];
      if (tabs.some(tab => tab.path === bare)) showTab(path);
      else showPage(path);
    } catch (error) {
      consoleError('useDeepLinks', error);
    }
  }).catch(() => {});   // web build: no native bridge, nothing to listen to
}

// `example://today?x=1` → `/today?x=1`; null for any other scheme.
// Custom schemes parse with the first segment as the HOST, hence the join.
export function deepLinkPath(url, scheme) {
  const parsed = new URL(url);
  if (parsed.protocol !== `${scheme}:`) return null;
  const path = `/${parsed.host}${parsed.pathname}`.replace(/\/+$/, '') || '/';
  return path + parsed.search;
}
