export default function () {
  const tabs = useAppTabs();
  consoleLog("showPageIndex", "tabs", tabs.value);
  if (tabs.value.length > 0) {
    const tab = tabs.value[0];
    consoleLog("showPageIndex", "path", tab.path);
    showPage(tab.path, false);
  }
  else {
    consoleLog("showPageIndex", "path", "/");
    showPage("/", false);
  }
}