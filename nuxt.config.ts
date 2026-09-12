// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const currentDir = dirname(fileURLToPath(import.meta.url));
export default defineNuxtConfig({
  $meta: { name: 'nuxt-ionic' },
  srcDir: join(currentDir, 'app'),
  compatibilityVersion: 4,
  ssr: true,
  debug: process.env.NODE_ENV !== 'production',
  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },
  extends: [
    // 'github:dalezak/nuxt-layer-supabase'
    '../nuxt-supabase'
  ],
  // (An `imports.presets` override used to pin `showError` to
  // `app/utils/show-error`. That file was renamed to `show-alert-error.js` in
  // b1984d9 — deliberately, so the util would stop colliding with Nuxt's
  // built-in instead of racing it — but the pin was left behind, aimed at a
  // path that no longer exists. An unresolvable auto-import is SILENTLY
  // SKIPPED, so the effect was to shadow Nuxt's own `showError` with nothing:
  // every build warned three times, and any future call to the documented Nuxt
  // API would have failed at runtime rather than at build. Removed; callers
  // want `showAlertError`, which 50 files already use.)
  css: [
    join(currentDir, 'app/assets/styles/default-white.css'),
    join(currentDir, 'app/assets/styles/default-dark.css'),
    join(currentDir, 'app/assets/styles/transition.css'),
    join(currentDir, 'app/assets/styles/typography.css'),
    join(currentDir, 'app/assets/styles/shape.css'),
    join(currentDir, 'app/assets/styles/spacing.css'),
    join(currentDir, 'app/assets/styles/reveal.css')
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    'nuxt-viewport',
    '@vite-pwa/nuxt'
  ],
  nitro: {
    prerender: {
      // /logout is auth-gated and does its work in onMounted — prerendering it
      // produces an empty shell that the client immediately replaces, so there
      // is nothing to gain from it in an Ionic SPA.
      //
      // It is excluded because it currently THROWS during prerender: Pinia's
      // `app:rendered` hook reports `nuxtApp.$pinia` undefined, which fails the
      // whole `nuxt generate` and therefore blocks `npx cap sync` (no ./dist).
      // Verified pre-existing — it reproduces with every local change stashed
      // in both this layer and the consuming app.
      //
      // KNOWN MASK, not a fix. If other auth-gated pages start getting
      // prerendered they will hit the same thing, and the underlying
      // Pinia-during-prerender problem is still there. Remove this line to
      // reproduce.
      ignore: ['/logout']
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Ionic',
      short_name: 'Nuxt Ionic',
      theme_color: '#ffffff',
      icons: [
        { src: 'favicon.ico', sizes: '64x64', type: 'image/x-icon' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      // Web-push handling lives in public/push-sw.js and is imported INTO the
      // generated service worker.
      //
      // It cannot simply be public/sw.js: @vite-pwa/nuxt generates /sw.js from
      // Workbox at build time and overwrites any static file at that path. A
      // hand-written public/sw.js therefore works in dev — where public files
      // are served as-is — and silently vanishes in production, taking push
      // notifications with it. Both love-well and best-self shipped that way;
      // the built sw.js in each had no `push` listener at all.
      importScripts: ['/push-sw.js']
    }
  },
  ionic: {
    integrations: {
      meta: true,
      pwa: false,
      icons: true,
      router: true
    },
    css: {
      core: true,
      basic: true,
      utilities: true
    }
  },
  viewport: {
    breakpoints: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    },
    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'sm',
      tablet: 'md',
    },
    fallbackBreakpoint: 'lg'
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@ionic/vue',
        'vue-next-masonry',
        'ionicons/icons',
        // `pluralize` ships as UMD/CJS; without explicit pre-bundling, Vite
        // serves the raw file and its `root.pluralize = ...` browser-global
        // fallback throws under strict ESM (root is undefined).
        'pluralize',
      ]
    }
  },
  pinia: {
    storesDirs: [
      join(currentDir, 'app/stores/**')
    ]
  }
})
