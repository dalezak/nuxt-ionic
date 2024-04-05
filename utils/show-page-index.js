export default function () {
  const appTabs = useAppTabs();
  const { isRoot } = useAppRoute();
  if (appTabs.value && appTabs.value.length > 0) {
    const appTab = appTabs.value[0];
    consoleLog("showPageIndex", "tab", appTab.path);
    rootPage(appTab.path);
  }
  else if (isRoot.value == false) {
    consoleLog("showPageIndex", "path", "/");
    rootPage("/");
  }
}