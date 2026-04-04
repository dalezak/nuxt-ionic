/**
 * Composable for paginated, searchable list pages.
 * Manages limit/offset/search/loading state and delegates data fetching to `loadFn`.
 * Use on any page that shows a filtered, paginated list.
 *
 * `state.count` reflects how many items were returned by the last fetch — compare to
 * `state.limit` to determine whether a Load More button should appear.
 *
 * @param {(params: {limit: number, offset: number, search: string}) => Promise<Array>} loadFn
 *   Async function that fetches data and returns an array. Receives the current pagination params.
 * @param {string} errorTitle - Header shown in the error alert if `loadFn` throws.
 * @returns {{
 *   state: { limit: number, offset: number, count: number, search: string, loading: boolean },
 *   searchChanged: (query?: string) => void,
 *   run: (offset?: number, event?: Event|null) => Promise<void>
 * }}
 * @example
 * const { state, searchChanged, run } = useSearchPagination(
 *   ({ limit, offset, search }) => fetchPosts({ limit, offset, search }),
 *   'Problem Loading Posts'
 * );
 * onMounted(() => run());
 */
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
      showAlertError(errorTitle, error.message);
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
