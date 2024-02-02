export function useAppTabs() {
  const appTabs = ref([]);
  const loggedIn = useLoggedIn();
  const { tabs } = useAppConfig();
  appTabs.value = tabs.filter(tab => tab.public == !loggedIn);
  return appTabs;
}
