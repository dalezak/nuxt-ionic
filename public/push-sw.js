// Web-push service worker — DEFAULT for every app extending nuxt-ionic.
//
// `useNotifications()` registers `/sw.js` when a user opts into notifications.
// Nuxt merges layer `public/` directories, so an app gets this automatically;
// an app that needs something bespoke drops its own `public/sw.js` in and that
// one wins.
//
// It lives here because forgetting it is silent and expensive: love-well had no
// sw.js for months, so its subscribe flow had nothing to attach a subscription
// to — the Edge Functions resolved recipients, posted to `send-web-push`, and
// delivered to nobody. Nothing errored anywhere.
//
// Native (Capacitor) reminders do NOT come through here; those are local
// notifications scheduled on-device. This path is browser + installed-PWA only.
//
// Payload, set by the layer's send-web-push:
//   { title, body, url?, appBadge? }
// `title` and `body` are required by the sender, so the fallbacks below are
// belt-and-braces rather than real defaults.

self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title ?? 'Reminder', {
        body: data.body ?? '',
        // The layer ships favicon.ico; an app with a proper 192px PNG should
        // override this file (or add its own icon and point at it here).
        icon: '/favicon.ico',
        // NOTE: this `badge` is the small monochrome glyph in the notification
        // shade — unrelated to the app-icon count handled below.
        badge: '/favicon.ico',
        data: { url: data.url ?? '/' },
      }),
      // App-icon count. Nothing client-side runs while the app is closed, so a
      // count written last night is still on the icon this morning, describing
      // yesterday. A push is the one moment it can be corrected while shut.
      // Absent means "leave the badge alone" — different from 0, "clear it".
      typeof data.appBadge === 'number' && self.navigator?.setAppBadge
        ? (data.appBadge > 0
            ? self.navigator.setAppBadge(data.appBadge)
            : self.navigator.clearAppBadge())
        : Promise.resolve(),
    ])
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Focus a tab already on that URL before opening anything — a nudge
      // should never leave someone with three copies of the app open.
      for (const client of clientList) {
        if (client.url.endsWith(url) && 'focus' in client) return client.focus();
      }
      // Otherwise reuse an open tab and navigate it; only then open a new one.
      const open = clientList.find(c => 'focus' in c && 'navigate' in c);
      if (open) return open.focus().then(c => c.navigate(url));
      return clients.openWindow(url);
    })
  );
});
