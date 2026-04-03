---
name: Project overview
description: Stack, architecture, key conventions for the nuxt-ionic Nuxt 4 + Ionic hybrid app
type: project
---

Nuxt 4 + Ionic Vue hybrid app (web + mobile). Supabase auth via extended layer `github:dalezak/nuxt-layer-supabase`.

**Why:** Serves as a reusable starter/layer for Ionic-based Nuxt apps.
**How to apply:** Follow existing file patterns and naming conventions when adding features.

Key facts:
- Language is **JavaScript only** — no new `.ts` files; existing `nuxt.config.ts` / `app.config.ts` are infrastructure-only
- UI: `@nuxtjs/ionic` (Ionic Vue components), `vue-next-masonry`, `swiper`
- State: Pinia (`stores/`)
- Responsive: `nuxt-viewport` breakpoints xs/sm/md/lg/xl
- Auto-imports from `composables/` and `utils/`; new utils that call other utils must add explicit `~/utils/...` imports
- Route constants live in `middleware/auth.js` (`ROUTES` object)
- Error handling: `showError` for catch blocks, `showWarning` for validation, `showAlert` for info; never `console.log` (use `consoleLog` from layer)
- Loading: `useLoading()` composable / `showLoading()` + `hideLoading()` utils
- Load More condition: `count > 0 && count % limit == 0`
- Tests: Vitest in `tests/utils/`, run with `npm test`
- CLAUDE.md exists at repo root with full guidelines
