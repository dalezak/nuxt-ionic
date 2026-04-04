/**
 * Applies the app theme by toggling the `dark` class on `document.body`.
 * Called once in `app.vue` on mount using values from `useAppConfig()`.
 * Theme CSS files are loaded globally via `nuxt.config.ts` css array
 * (default-white.css and default-dark.css).
 * @param {string} theme - Theme name (currently unused; reserved for future multi-theme support).
 * @param {boolean} dark - If true, adds the `dark` class; otherwise removes it.
 * @example
 * const { theme, dark } = useAppConfig();
 * settingsTheme(theme, dark);
 */
export default function (theme = "default", dark = false) {
  if (process.client) {
    consoleLog('settingsTheme', theme, dark);
    if (dark) {
      document.body.classList.add('dark');
    }
    else {
      document.body.classList.remove('dark');
    }
  }
}