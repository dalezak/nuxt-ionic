export function useAppTabs() {
  const appTabs = ref([]);
  const { tabs } = useAppConfig();
  const loggedIn = useLoggedIn();
  appTabs.value = tabs.filter(tab => tab.public == !loggedIn);
  return appTabs;
}
