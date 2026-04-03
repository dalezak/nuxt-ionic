// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityVersion: 4,
  ssr: true,
  debug: process.env.NODE_ENV !== 'production',
  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },
  extends: [
    'github:dalezak/nuxt-layer-supabase'
  ],
  css: [
    './app/assets/styles/default-white.css',
    './app/assets/styles/default-dark.css',
    './app/assets/styles/transition.css'
  ],
  modules: [
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
      'app/stores/**',
      '../nuxt-supabase/stores/**'
    ]
  }
})
