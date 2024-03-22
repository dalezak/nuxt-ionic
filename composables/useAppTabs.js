import { watch } from "vue";

export function useAppTabs() {
  const appTabs = ref([]);
  const appUser = useAppUser();
  const { tabs } = useAppConfig();

  watch(appUser, (newAppUser, oldAppUser) => {
    appTabs.value = tabs.filter(tab => tab.public == !appUser.value);
  });
  appTabs.value = tabs.filter(tab => tab.public == !appUser.value);

  return appTabs;
}
