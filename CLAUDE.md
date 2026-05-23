# CLAUDE.md

Guidelines for Claude Code when working in this repository.

This layer extends `github:dalezak/nuxt-layer-supabase` (locally `../nuxt-supabase`). The data/store/model architectural principles live there — read its CLAUDE.md too.

## Architectural principles

These rules govern any app that extends this layer.

### Use Ionic components first

Default to `@ionic/vue` components (`<ion-page>`, `<ion-content>`, `<ion-list>`, `<ion-button>`, `<ion-input>`, etc.) over plain HTML. Ionic gives consistent web / iOS / Android UX. Reach for raw HTML only when no Ionic component fits.

### Logic goes in composables, not pages

Stateful or reactive logic shared across pages belongs in `app/composables/`. Pages should be thin — wire up the composable, render the template.

### UI fragments go in components, not pages

Reusable markup belongs in `app/components/`. If a page is growing past one screen of template, extract a component.

### Pure functions go in utils, not pages

Pure helpers (formatting, sorting, transforming) go in `app/utils/` — kebab-case files, auto-imported as camelCase. If the helper is generic, push it into this layer's `utils/` rather than keeping it in the consuming app.

### Use Nuxt's nested component naming

Group related components in subfolders. Nuxt flattens the path into the component name, so `app/components/course/Card.vue` becomes `<CourseCard>` and `app/components/lesson/list/Item.vue` becomes `<LessonListItem>`. Prefer subfolders over long prefixed filenames.

### Error UX from catch blocks

Use the layer's error helpers from catch blocks; don't leave writes failing silently. The helpers log via `consoleError` internally, so a separate `consoleError(...)` call before them is redundant.

- **`showToastError(title, error)`** — non-blocking toast (red). Default for user-initiated writes that can simply be retried: save / archive / delete / add / accept / etc. Doesn't interrupt flow.
- **`showAlertError(title, error)`** — blocking alert dialog. For critical or destructive flows where the user needs to acknowledge: failed group creation, failed reflection save where the data would otherwise be lost.
- **`consoleError(label, error)`** — log-only, no UI. For background tasks (milestones, streak updates) where failure isn't load-bearing, or for `loadData` paths that show an empty state on failure.

Pages should pick deliberately — every silent-fail write is a bug in waiting.

### Push reusable logic up into this layer

If new code is generic enough to benefit other apps extending `nuxt-ionic`, add it here rather than in the consuming app. Keep app-specific logic in the app; keep cross-app logic upstream.

When uncertain, ask: "Would another app extending this layer want this?" If yes, it belongs in the layer.

## Friends + Groups: one social tab

Witness is the primary social verb. Friends (bilateral) and Groups (multilateral) are two ways to curate the same activity feed — they share kudos, share visibility, share the same surface. **Don't give each its own tab.** Mobile's 5-tab budget gets eaten by social plumbing instead of app-specific verbs.

### Structure inside the tab

```text
┌─ <Social> tab ───────────────────┐
│ [Add a friend / paste invite]    │
│                                  │
│ ── Activity feed ──              │
│ Sara earned …       [♥ 3]       │
│ Group "Mornings" …  [♥ 1]       │
│                                  │
│ ── Friends ──                    │
│ … list                           │
│                                  │
│ ── Groups ──                     │
│ … list                           │
└──────────────────────────────────┘
```

The activity feed at top is load-bearing — it unifies witness across both kinds of curation.

Tab name varies by app personality (Friends, Community, Together, Cohort, Circle), but structure stays the same.

### Resolving placement inside the tab

Friends/Groups lists are **admin** surfaces (manage your circle); the activity feed is the **product** (witness your circle). When in doubt, ask: "is this about managing or witnessing?" That resolves most cases.

### Implications

- **5-tab budget preserved** for app-specific verbs (Courses, Habits, Saves, Growth, …).
- **Tier-friendly.** Groups can sit behind a paywall as a dimmed/upsell section — no tab disappears when the user upgrades.
- **Onboarding-friendly.** New users see Friends; Groups reveal as a deeper tool.
- **Detail pages** (`/friends/[id]`, `/groups/[id]`) sit under this tab.

### Out of scope for this convention

Saved content (lessons, bookmarks, library) is a *content* concern, not a *social* one — keep it separate, typically under Profile or as its own surface depending on the app's weight.

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

## Hosting & deployment

Apps on this layer ship to three targets from one codebase:

- **Web → Cloudflare** (Cloudflare Pages with the Nitro `cloudflare-pages` preset). SSR is on, so the Nitro server runs as a Cloudflare Worker and `server/api/*` routes are reachable from the browser. Set the preset per-app via `NITRO_PRESET=cloudflare-pages` or in `nuxt.config.ts`.
- **iOS → App Store** via Capacitor (`@capacitor/ios` + Xcode build & sign).
- **Android → Play Store** via Capacitor (`@capacitor/android` + Android Studio build & sign).

Mobile builds are static, web builds are SSR. The switch lives in the consuming app's `nuxt.config.ts`:

```js
ssr: process.env.APP_ENV !== 'mobile',
```

The mobile script runs `APP_ENV=mobile nuxt generate && npx cap sync` — `nuxt generate` produces a static bundle (no Nitro server in the iOS/Android shell), then `cap sync` copies it into the native projects for Xcode / Android Studio to build and sign.

Implications for code in this layer:

- **No Nitro server on mobile.** `server/api/*` routes don't exist on device — anything mobile needs to call must be a Supabase Edge Function (see the supabase layer). `server/api/*` is reserved for web-only concerns: SSR data fetching, OG images, webhooks landing on the app's domain.
- **Public env vars only in client code.** Web has access to Cloudflare-injected runtime config; mobile only has what was inlined at `nuxt generate` time. Use `useRuntimeConfig().public.*` and `NUXT_PUBLIC_*` env vars — anything needed at runtime on mobile must be public-safe.
- **App Store / Play Store metadata** (icons, splash, bundle id, version) is configured per-app in `capacitor.config.ts`, `ios/`, and `android/` — not in this layer.

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
  composables/         # useAppRoute, useAppScreen, useAppTabs, useIonPage, useLoading, useSearchPagination
  middleware/auth.js   # Route guard using ROUTES constants
  pages/               # File-based routing (tabs/, reset, logout)
  plugins/             # masonry.js, ion-router.js
  stores/              # Pinia stores
  utils/               # Auto-imported utility functions (kebab-case → camelCase)
```

## Path aliases

- `~/` resolves to `app/` inside Vue/JS source files (components, pages, utils, composables).
- Do **not** use `~/` in `nuxt.config.ts` — it is not resolved there. Use `./app/...` paths relative to the project root instead (e.g. for `css:` entries).

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

## Page conventions

How pages are structured. Follow these for every new page.

### Auth-protected pages

Add `definePageMeta({ middleware: 'auth' })` at the top of `<script setup>`. The `auth` middleware lives in this layer and checks `useAppUser()`.

### Page lifecycle

Use `useIonPage().onPageLoad(loadData)` rather than `onMounted` for initial data fetch. Ionic caches pages, and `onMounted` only fires once across the page's lifetime — `onPageLoad` fires when the page becomes active again.

### Conditional native UI

Show toolbars/headers only on the native app shell:

```vue
<ion-header v-if="isApp">
  <ion-toolbar>
    <ion-title>Page</ion-title>
  </ion-toolbar>
</ion-header>
```

`isApp` comes from `useAppScreen()`.

### Navigation

Navigate via the `show-*` utils, not `router.push`:

- `showPage('/path')` — push to a route
- `showModal(Component, props)` — present a modal
- `showConfirm(title, sub, message, onConfirm, confirmLabel, cancelLabel)` — confirmation dialog
- `showAlert`, `showToast`, `showActionSheet`, `showPopover`, `showPrompt`, `showForm`

For app-specific destinations (e.g. course details), wrap them in a local util: `app/utils/show-course-details.js` exporting `showPage(\`/courses/${id}\`, true)`. This keeps call sites uniform and routes centralized.

### Refresher

Standard pull-to-refresh:

```vue
<ion-refresher slot="fixed" @ionRefresh="onRefresh($event)">
  <ion-refresher-content />
</ion-refresher>
```

```js
async function onRefresh(event) {
  await loadData();
  event?.target?.complete?.();
}
```

### Reactive page state

Group page-local state in a single `reactive()` object rather than scattering refs:

```js
const state = reactive({
  loading: false,
  items: [],
});
```

### Store access in components

Destructure store actions directly, but use `storeToRefs` for reactive getters/state:

```js
const coursesStore = useCoursesStore();
const { loadItems } = coursesStore;
const { getItems } = storeToRefs(coursesStore);
```

### Async error handling

Wrap data-loading async work in `try/catch/finally`. Use `consoleError(label, error)` in catch (auto-imported from `nuxt-supabase`) and toggle `state.loading` in finally:

```js
async function loadData() {
  state.loading = true;
  try {
    const data = await someStore.loadItems();
    state.items = data;
  } catch (error) {
    consoleError('home loadData', error);
  } finally {
    state.loading = false;
  }
}
```

For user-facing failures (form submits, deletes, etc.) use `showError(title, error)` so the user sees the problem; reserve `consoleError` for background loads where a console line is enough.

### Empty states

When a list is empty, render an empty-state component with `icon`, `title`, and optional `subtitle`. Inside `<grid-cards>` / `<list-cards>`, put it in the `#empty` slot:

```vue
<grid-cards :count="items.length" :limit="state.limit">
  <item-card v-for="item in items" :key="item.id" :item="item" />
  <template #empty>
    <empty-state
      :icon="ioniconsBookOutline"
      title="Nothing here yet"
      subtitle="Tap + to get started." />
  </template>
</grid-cards>
```

### Onboarding as a flow page (outside `tabs/`)

First-run / signup flows are linear — pillar pick → template pick → adopt → done — and they want the full screen with no tab-bar chrome distracting the user. **Convention: put onboarding at `app/pages/onboarding.vue` (top level, NOT inside `app/pages/tabs/`).** The tab bar's parent route is `tabs.vue`; pages outside that subtree render alone, which is exactly what a flow page wants.

```text
app/pages/
├── tabs.vue                ← parent with <nav-bar> + <tab-bar>
├── tabs/
│   ├── home.vue            ← inherits chrome from tabs.vue
│   ├── courses/...
│   └── profile.vue
└── onboarding.vue          ← top-level, no chrome
```

The same pattern works for any other "focused linear flow" page — a welcome / first-paid-purchase / one-shot wizard. Anything that's not a recurring tab destination belongs outside `tabs/`.

Gating into and out of the flow:

```js
// inside onboarding.vue
definePageMeta({ middleware: 'auth' });

// inside the relevant tab (e.g. tabs/home.vue) — redirect to onboarding if the
// user is still in the pre-state the flow exists to resolve.
async function loadData() {
  const habits = await habitsStore.loadItems({ refresh: true });
  if (!habits || habits.length === 0) {
    router.push('/onboarding');
    return;
  }
  // ... regular page load
}

// inside onboarding.vue, after the flow completes:
router.push('/home');
```

The home tab carries the "still pre-state?" check; onboarding owns the linear flow + the post-flow redirect. Clean handoff with no app-state coupling.

## Layer-provided components

Generic UI primitives lifted from suite apps. Use these directly via auto-import — no need to redefine in apps.

- **`<EmptyState>`** (`empty-state.vue`) — "no items here" surface for lists. Props: `icon` (Ionic icon constant, required), `title` (required), `subtitle` (optional).
- **`<WheelChart>`** (`wheel-chart.vue`) — hand-rolled SVG radial/wheel-of-life chart with N axes. Each axis shows a labeled wedge that fills from center to the data value (max at outer ring). Themed via Ionic CSS variables. Props: `axes` (array of `{ label, value, max? }`) — tappable wedges emit click events. Use for pillar wheels, skill radars, virtue maps — any "score across N dimensions" surface where balance/shape matters more than ranking.
- **`<AccentCard>`** (`accent-card.vue`) — wrapped `<ion-card>` with a colored header strip + title + optional subtitle/icon. Slot-based content. Props: `title` (required), `subtitle`, `icon`, `color` (default `'primary'`).
- **`<StepTimeline>`** (`step-timeline.vue`) — vertical sequence of steps rendered as connected nodes down a left-edge rail (✓ completed / ◯ current / ◯ upcoming). Communicates progression through a sequence — today's plan, daily ritual, onboarding flow — rather than a flat list. Props: `steps` (array of `{ id, title, subtitle?, status? }`); status is auto-derived as the first non-completed step if not set. Slots: `step` (global body override), `step-{id}` (per-step override). Emits `step-click(step, index)`.
- **`<ShareButton>`**, **`<SharePopover>`** — see share-social pattern.

`<BadgeCard>` is now provided by `nuxt-badges` (not this layer) — apps that extend `nuxt-badges` get it automatically.

Apps add their own components (nested by feature) for app-specific surfaces.

## Component conventions

- **`<script setup>` only.** No Options API.
- **`defineProps`** for inputs; `defineEmits` only when emitting. Props get a `type` and `required` or `default`.
- **`<style scoped>`** is the default — keep styles co-located with the component, not in global CSS. Use `var(--ion-color-*)` and `var(--ion-text-color)` so themes propagate.
- **No global CSS for component-specific styling** — global styles belong in `app/assets/styles/` (and theme files).

## Capacitor plugins — wrap with web-safe fallbacks

iOS and Android are distributed as Capacitor apps (`APP_ENV=mobile nuxt generate && npx cap sync`). The same code also runs on the web, so any Capacitor plugin call must work on both — wrap it in a util under `app/utils/` and never import `@capacitor/*` directly from a page or component.

The wrapper's job is to try the native plugin and fall back to a web-safe alternative. Use the plugin's own capability check (or `isPlatform('capacitor')` from `@ionic/vue` when no plugin-level check exists) to branch:

```js
// app/utils/share-social.js
import { Share } from '@capacitor/share';
import SharePopover from '~/components/share-popover.vue';

export default async function ({ title, description, url }, event = null) {
  const canShare = await Share.canShare();
  if (canShare?.value) {
    return Share.share({ title, text: description, url });
  }
  if (event) {
    return showPopover(SharePopover, event, { title, description, url });
  }
  return shareSheet({ title, description, url });
}
```

Call sites only see `shareSocial(...)` — the platform branching lives in one place. Apply the same pattern for haptics, status bar, keyboard, app state, etc.: native call when available, graceful no-op or web equivalent when not. If a Capacitor feature has no reasonable web fallback, gate the calling UI on `isPlatform('capacitor')` rather than letting it crash on web.

Note: `isApp` from `useAppScreen()` is a *viewport* check (narrow layout), not a native-runtime check. Use `isPlatform('capacitor')` for the latter.

## Icon constants

Ionicon names are auto-imported as `ionicons<Name>` constants — use those instead of importing from `ionicons/icons`:

```vue
<ion-icon :icon="ioniconsBookOutline" />
<ion-icon :icon="ioniconsAdd" />
```

## Static config in app.config.ts

Static lookup data (tabs, plans, feature lists) belongs in `app.config.ts` and is read via `useAppConfig()`. Don't create separate constants files.

## Theming

Theme variants live in `app/assets/styles/themes/*.css` as `:root { --ion-* }` overrides. The consuming app's `theme.css` selects the active theme via a single `@import` — comment-swap to change themes:

```css
@import './themes/indigo-spark.css';
/* @import './themes/teal-focus.css'; */
```

Components reference Ionic CSS variables (`var(--ion-color-primary)`, `var(--ion-text-color)`, `var(--ion-color-medium)`) — never hardcoded hex. Use semantic Ionic colors (`color="primary"`, `color="success"`, etc.) on components.

## Testing

Tests live in `tests/utils/` and use **Vitest** (`npm test`). The `~` alias resolves to the project root. Mock Ionic-dependent modules with `vi.mock('~/utils/show-toast.js', ...)` rather than importing them directly into tests.

## ESLint

Rules are in `.eslintrc.js`. Active rules: `no-unused-vars`, `consistent-return`, `no-console`, `eqeqeq`. Do not disable these without a comment explaining why.
