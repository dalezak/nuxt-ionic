export default function () {
  const { tabs } = useAppConfig();
  const user = useCurrentUser();
  const noUser = user.value == null;
  const appTabs = tabs.filter(tab => tab.public == noUser);
  if (appTabs.length > 0) {
    const tab = appTabs[0];
    consoleLog("showPageIndex", tab.name);
    showPage(tab.path, false);
  }
  else {
    consoleLog("showPageIndex", "index");
    showPage("/", false);
  }
}