export function useAppTabs() {
  const appTabs = ref([]);
  const appUser = useAppUser();
  const { tabs } = useAppConfig();
  appTabs.value = tabs.filter(tab => tab.public == !appUser.value);
  return appTabs;
}
