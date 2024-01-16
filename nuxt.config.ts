// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const fileUrl = fileURLToPath(import.meta.url);
const currentDir = dirname(fileUrl);
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
    join(currentDir, './assets/styles/default-white.css'),
    join(currentDir, './assets/styles/default-dark.css'),
    join(currentDir, './assets/styles/transition.css')
  ],
  modules: [
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    'nuxt-viewport'
  ],
  plugins: [
    join(currentDir, './plugins/masonry.js')
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
      'stores/**',
      '../nuxt-supabase/stores/**'
    ]
  }
})
