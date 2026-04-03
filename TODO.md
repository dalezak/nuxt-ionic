# Code Review TODO

## Critical — Bugs that cause broken behavior

- [x] **Fix parameter name mismatches in `utils/open-email.js` and `utils/open-phone.js`** — parameter is named `url` but body references `email` / `telephone`, opens `mailto:undefined`
- [x] **Fix logic bug in `composables/useAppRoute.js`** — `isPath(path)` compares `path == path`, always returns `true`, function is completely broken
- [x] **Fix swapped date/time formatters** — `utils/text-date.js` calls `toLocaleTimeString` and `utils/text-datetime.js` calls `toLocaleDateString`, names and implementations are inverted

## High — Bugs or anti-patterns with real impact

- [x] **Fix global `window.loading` anti-pattern in `utils/show-loading.js` / `hide-loading.js`** — loading state stored on `window` causes race conditions, no reactivity, potential memory leaks; move to Pinia store or composable
- [x] **Add null/undefined guard to `utils/text-truncate.js`** — crashes if `text` is `null` or `undefined`
- [x] **Add type/null guard to `utils/text-money.js`** — crashes if `amount` is `null`, `NaN`, or a non-numeric string
- [x] **Fix props immutability bug in `components/share-popover.vue`** — `properties` object is built once on mount and won't react if props change; should use `computed`
- [x] **Fix inconsistent Load More logic between `components/grid-cards.vue` and `components/list-cards.vue`** — grid uses `count % limit == 0`, list uses `count == limit`, causing inconsistent pagination behaviour

## Medium — Maintainability and correctness issues

- [x] **Replace magic string route paths in `middleware/auth.js`** — hardcoded `/login`, `/reset`, `/logout` strings break silently if paths change; use route name constants
- [x] **Complete or remove `components/slides-bar.vue`** — incomplete template with hardcoded "Slide 1 / Slide 2 / Slide 3…" placeholder content
- [x] **Clean up commented-out platform detection code in `composables/useAppScreen.js`** — restore with documentation or remove
- [x] **Make `debug` and `devtools` flags environment-conditional in `nuxt.config.ts`** — both are unconditionally enabled; should check `NODE_ENV`
- [x] **Add explicit imports to utils that rely on Nuxt auto-imports** — `show-page.js`, `show-page-index.js`, `hide-page.js`, `has-input.js`, `share-sheet.js` reference functions with no imports; fragile and hard to trace
- [x] **Add null/invalid date guards to `utils/text-date.js` and `utils/text-datetime.js`** — no guard against invalid strings passed to `new Date()`

## Low — Code quality and long-term health

- [x] **Add stricter ESLint rules** — current config is minimal; add `no-unused-vars`, `consistent-return`, etc.
- [x] **Add unit tests for utility functions** — especially text formatters, `has-input`, `has-more`
- [x] **Standardise error handling across utils** — mixed use of `showError()`, `showAlert()`, and `console.log`
- [x] **Document public API of each component and composable** — props, emits, and slots are undocumented
