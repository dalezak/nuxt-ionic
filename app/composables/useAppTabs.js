/**
 * Composable that returns the filtered tab list for the current auth state.
 * Tabs marked `public: true` are shown to guests; `public: false` to signed-in users.
 * Re-filters reactively when the authenticated user changes.
 * @returns {import('vue').Ref<Array<{path: string, public: boolean, [key: string]: any}>>}
 */
export function useAppTabs() {
  const appTabs = ref([]);
  const { tabs } = useAppConfig();
  const { isAuthenticated } = useAuthSession();

  function filterTabs(auth) {
    appTabs.value = tabs.filter(tab => tab.public == !auth);
  }

  watch(isAuthenticated, (auth) => filterTabs(auth));
  filterTabs(isAuthenticated.value);

  return appTabs;
}
