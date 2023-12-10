// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  debug: true,
  devtools: { 
    enabled: true 
  },
  extends: [
    'github:dalezak/nuxt-layer-supabase'
  ],
  css: [
    '@/assets/default-white.css',
    '@/assets/default-dark.css',
    '@/assets/transition.css'
  ],
  modules: [
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    '@vue-macros/nuxt',
    'nuxt-viewport',
  ],
  plugins: [
    '~/plugins/masonry.js',
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
  }
})
