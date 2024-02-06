export default function () {
  const appUser = useAppUser();
  const { tabs } = useAppConfig();
  const appTabs = tabs.filter(tab => tab.public == !appUser.value);
  consoleLog("showPageIndex", "tabs", appTabs.value);
  if (appTabs.value.length > 0) {
    const tab = appTabs.value[0];
    consoleLog("showPageIndex", "path", tab.path);
    showPage(tab.path, false);
  }
  else {
    consoleLog("showPageIndex", "path", "/");
    showPage("/", false);
  }
}