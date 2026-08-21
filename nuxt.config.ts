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
  // Explicit override: register our `showError` from app/utils so it beats
  // Nuxt's built-in `showError` (from `#app/composables/error`) which would
  // navigate to the full-screen error page. The auto-import scan picks up
  // app/utils/* but in conflict cases Nuxt's built-in can win; this entry
  // pins precedence.
  imports: {
    imports: [
      { name: 'default', as: 'showError', from: join(currentDir, 'app/utils/show-error') },
    ],
  },
  css: [
    join(currentDir, 'app/assets/styles/default-white.css'),
    join(currentDir, 'app/assets/styles/default-dark.css'),
    join(currentDir, 'app/assets/styles/transition.css'),
    // One stylesheet per shared component — the single place its look is
    // defined AND the single place an app overrides it (app CSS loads after
    // these, so an app rule wins without needing !important or a fork).
    join(currentDir, 'app/assets/styles/components/accent-card.css'),
    join(currentDir, 'app/assets/styles/components/bar-chart.css'),
    join(currentDir, 'app/assets/styles/components/completion-hero.css'),
    join(currentDir, 'app/assets/styles/components/confetti.css'),
    join(currentDir, 'app/assets/styles/components/consistency-grid.css'),
    join(currentDir, 'app/assets/styles/components/dimension-bars.css'),
    join(currentDir, 'app/assets/styles/components/empty-state.css'),
    join(currentDir, 'app/assets/styles/components/faq-list.css'),
    join(currentDir, 'app/assets/styles/components/feature-list.css'),
    join(currentDir, 'app/assets/styles/components/filter-bar.css'),
    join(currentDir, 'app/assets/styles/components/filter-chips.css'),
    join(currentDir, 'app/assets/styles/components/label-chips.css'),
    join(currentDir, 'app/assets/styles/components/login-modal.css'),
    join(currentDir, 'app/assets/styles/components/markdown-text.css'),
    join(currentDir, 'app/assets/styles/components/modal-footer-nav.css'),
    join(currentDir, 'app/assets/styles/components/page-error.css'),
    join(currentDir, 'app/assets/styles/components/page-header.css'),
    join(currentDir, 'app/assets/styles/components/page-hero.css'),
    join(currentDir, 'app/assets/styles/components/page-welcome.css'),
    join(currentDir, 'app/assets/styles/components/pill-toggle.css'),
    join(currentDir, 'app/assets/styles/components/player-outro.css'),
    join(currentDir, 'app/assets/styles/components/player-time.css'),
    join(currentDir, 'app/assets/styles/components/player-wave.css'),
    join(currentDir, 'app/assets/styles/components/pricing-plan-card.css'),
    join(currentDir, 'app/assets/styles/components/profile-header.css'),
    join(currentDir, 'app/assets/styles/components/progress-meter.css'),
    join(currentDir, 'app/assets/styles/components/provenance-chip.css'),
    join(currentDir, 'app/assets/styles/components/rating-bar.css'),
    join(currentDir, 'app/assets/styles/components/rating-scale.css'),
    join(currentDir, 'app/assets/styles/components/rating-sparkline.css'),
    join(currentDir, 'app/assets/styles/components/section-card.css'),
    join(currentDir, 'app/assets/styles/components/section-group.css'),
    join(currentDir, 'app/assets/styles/components/section-lede.css'),
    join(currentDir, 'app/assets/styles/components/section-title.css'),
    join(currentDir, 'app/assets/styles/components/slides-pager.css'),
    join(currentDir, 'app/assets/styles/components/stat-tile.css'),
    join(currentDir, 'app/assets/styles/components/stats-card.css'),
    join(currentDir, 'app/assets/styles/components/stats-grid.css'),
    join(currentDir, 'app/assets/styles/components/step-timeline.css'),
    join(currentDir, 'app/assets/styles/components/suggestion-chips.css'),
    join(currentDir, 'app/assets/styles/components/thinking-indicator.css'),
    join(currentDir, 'app/assets/styles/components/week-strip.css'),
    join(currentDir, 'app/assets/styles/components/weekly-dots.css'),
    join(currentDir, 'app/assets/styles/components/wheel-chart.css'),
    join(currentDir, 'app/assets/styles/components/year-heatmap.css'),
    join(currentDir, 'app/assets/styles/typography.css'),
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
