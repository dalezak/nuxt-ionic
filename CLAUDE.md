# CLAUDE.md

Guidelines for Claude Code when working in this repository.

## Language

- **Use JavaScript, not TypeScript.** All utils, composables, plugins, and pages are `.js` / `.vue` files. Do not create `.ts` files or add type annotations. The only `.ts` files that exist (`nuxt.config.ts`, `app.config.ts`, `tsconfig.json`) are Nuxt infrastructure — do not add more.

## Stack

- **Nuxt 4** with SSR enabled
- **Ionic Vue** (`@nuxtjs/ionic`) for UI components and mobile navigation
- **Pinia** (`@pinia/nuxt`) for state management — stores go in `stores/`
- **Supabase** via the extended layer `github:dalezak/nuxt-layer-supabase`
- **nuxt-viewport** for responsive breakpoints (xs 320, sm 576, md 768, lg 992, xl 1200)
- **Swiper** for slide components
- **vue-next-masonry** for masonry grid layouts

## Project structure

Nuxt 4 layout — source files live under `app/`, config and server stay at root.

```text
nuxt.config.ts         # Nuxt + Ionic + viewport + Pinia config (root)
app.config.ts          # App name, theme, tabs config (root)
server/                # Nitro server routes (root)
public/                # Static assets served at / (root)
tests/utils/           # Vitest unit tests (root)

app/
  app.vue              # Root: <ion-app> + <ion-router-outlet>
  error.vue            # Custom error page
  assets/styles/       # Global CSS (default-white, default-dark, transition)
  components/          # Reusable Vue components
  composables/         # useAppRoute, useAppScreen, useAppTabs, useLoading
  middleware/auth.js   # Route guard using ROUTES constants
  pages/               # File-based routing (tabs/, reset, logout)
  plugins/             # masonry.js, ion-router.js
  stores/              # Pinia stores
  utils/               # Auto-imported utility functions (kebab-case → camelCase)
```

## Auto-imports

Nuxt auto-imports everything from `composables/` and `utils/`. When writing a new util or composable that calls another local util, **add an explicit import** so dependencies are traceable:

```js
import showToast from '~/utils/show-toast.js';
```

Use `#imports` for Nuxt core composables (`useRouter`, `useNuxtApp`, etc.) that need explicit imports in utils files.

## Naming conventions

- Util files: `kebab-case.js` → auto-imported as `camelCase` (e.g. `show-toast.js` → `showToast()`)
- Composables: `useAppThing.js` exporting `export function useAppThing()`
- Components: `PascalCase.vue` rendered as `<kebab-case>` or `<PascalCase>`

## Route paths

Route paths are defined as constants in `middleware/auth.js` (`ROUTES.HOME`, `ROUTES.LOGIN`, etc.). Use these constants rather than hardcoding strings when navigating.

## Error handling

- **Errors** (catch blocks, unexpected failures): use `showError(title, error)`
- **Warnings / validation failures**: use `showWarning(title, message)`
- **Informational alerts**: use `showAlert(title, message)`
- **Do not** call `console.log` directly — use `consoleLog()` (provided by the Supabase layer)

## Loading overlay

Use the `useLoading()` composable (or its `showLoading()` / `hideLoading()` util wrappers). Do not store loading state on `window`.

## Pagination / Load More

Show a Load More button when `count > 0 && count % limit == 0`. Both `grid-cards` and `list-cards` use this rule.

## Testing

Tests live in `tests/utils/` and use **Vitest** (`npm test`). The `~` alias resolves to the project root. Mock Ionic-dependent modules with `vi.mock('~/utils/show-toast.js', ...)` rather than importing them directly into tests.

## ESLint

Rules are in `.eslintrc.js`. Active rules: `no-unused-vars`, `consistent-return`, `no-console`, `eqeqeq`. Do not disable these without a comment explaining why.
