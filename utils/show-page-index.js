export default function () {
  const { tabs } = useAppConfig();
  const user = useCurrentUser();
  const hasUser = user.value != null;
  const authTabs = tabs.filter(tab => tab.auth == hasUser);
  if (authTabs.length > 0) {
    const tab = authTabs[0];
    showPage(tab.path, false);
  }
  else {
    showPage("/", false);
  }
}