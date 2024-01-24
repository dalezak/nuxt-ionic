export default function () {
  const { tabs } = useAppConfig();
  const user = useCurrentUser();
  const noUser = user.value == null;
  const appTabs = tabs.filter(tab => tab.public == noUser);
  if (appTabs.length > 0) {
    const tab = appTabs[0];
    showPage(tab.path, false);
  }
  else {
    showPage("/", false);
  }
}