export function useSearchPagination(loadFn, errorTitle) {
  const state = reactive({
    limit: 12,
    offset: 0,
    count: 0,
    search: "",
    loading: false
  });

  function searchChanged(query = "") {
    state.search = query;
    run();
  }

  async function run(offset = 0, event = null) {
    try {
      state.loading = true;
      state.offset = offset;
      const results = await loadFn({ limit: state.limit, offset: state.offset, search: state.search });
      state.count = results ? results.length : 0;
    }
    catch (error) {
      consoleError(errorTitle, error);
      showError(errorTitle, error.message);
    }
    finally {
      state.loading = false;
      if (event && event.target) {
        event.target.complete();
      }
    }
  }

  return { state, searchChanged, run };
}
