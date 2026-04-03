// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  debug: process.env.NODE_ENV !== 'production',
  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },
  extends: [
    'github:dalezak/nuxt-layer-supabase'
  ],
  css: [
    '~/assets/styles/default-white.css',
    '~/assets/styles/default-dark.css',
    '~/assets/styles/transition.css'
  ],
  modules: [
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    'nuxt-viewport'
  ],
  ionic: {
    integrations: {
      meta: true,
      pwa: true,
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
  pinia: {
    storesDirs: [
      'app/stores/**',
      '../nuxt-supabase/stores/**'
    ]
  }
})
