export default async function () {
  const { tabs } = useAppConfig();
  const user = useCurrentUser();
  const noUser = user.value == null;
  const appTabs = tabs.filter(tab => tab.public == noUser);
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