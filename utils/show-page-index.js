export default async function () {
  const { tabs } = useAppConfig();
  const hasCurrent = useHasCurrent();
  const isPublic = hasCurrent == false;
  const appTabs = tabs.filter(tab => tab.public == isPublic);
  if (appTabs.length > 0) {
    const tab = appTabs[0];
    consoleLog("showPageIndex", tab.path);
    showPage(tab.path, false);
  }
  else {
    consoleLog("showPageIndex", "/");
    showPage("/", false);
  }
}