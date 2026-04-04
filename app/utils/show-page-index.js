import showPage from '~/utils/show-page.js';

/**
 * Navigates to the app's index/home page using a root transition.
 * If tabs are configured in `app.config.ts`, navigates to the first tab's path.
 * If already at root, does nothing. Use after login/logout to reset the nav stack.
 * @example
 * showPageIndex(); // after login
 */
export default function () {
  const appTabs = useAppTabs();
  const { isRoot } = useAppRoute();
  if (appTabs.value && appTabs.value.length > 0) {
    const appTab = appTabs.value[0];
    consoleLog("showPageIndex", "tab", appTab.path);
    showPage(appTab.path, false, true);
  }
  else if (isRoot.value == false) {
    consoleLog("showPageIndex", "path", "/");
    showPage("/", false, true);
  }
}