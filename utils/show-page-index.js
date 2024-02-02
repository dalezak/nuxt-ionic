export default function () {
  const tabs = useAppTabs();
  if (tabs.length > 0) {
    const tab = tabs[0];
    consoleLog("showPageIndex", tab.path);
    showPage(tab.path, false);
  }
  else {
    consoleLog("showPageIndex", "/");
    showPage("/", false);
  }
}