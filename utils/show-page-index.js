export default function () {
  const appTabs = useAppTabs();
  const { isRoot } = useAppRoute();
  consoleLog("showPageIndex", "tabs", appTabs.value);
  if (appTabs.value && appTabs.value.length > 0) {
    const appTab = appTabs.value[0];
    consoleLog("showPageIndex", "path", appTab.path);
    showPage(appTab.path, false);
  }
  else if (isRoot.value == false) {
    consoleLog("showPageIndex", "path", "/");
    showPage("/", false);
  }
}