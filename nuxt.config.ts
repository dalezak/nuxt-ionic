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
    join(currentDir, 'app/assets/styles/transition.css')
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    'nuxt-viewport',
    '@vite-pwa/nuxt'
  ],
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
      navigateFallback: '/'
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
      ]
    }
  },
  pinia: {
    storesDirs: [
      join(currentDir, 'app/stores/**')
    ]
  }
})
