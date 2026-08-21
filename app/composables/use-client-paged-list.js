// Client-side "reveal N at a time" paging for an already-loaded, filtered list
// (books / quotes / definitions browse surfaces). The full set is in memory;
// this just caps how many render and grows the cap on "Load more". Pair the
// returned `reset` with a watch on the filter/search state so changing a filter
// jumps back to the first page.
//
//   const { visible, hasMore, loadMore, reset } =
//     useClientPagedList(filteredBooks, { pageSize: 20 });
//   watch([() => state.filterTopic, () => state.query], reset);
//
// `source` may be a ref, computed, or getter-returning-array — anything `unref`
// resolves to the current array.
export function useClientPagedList(source, { pageSize = 30 } = {}) {
  const all = computed(() => unref(source) ?? []);
  const displayLimit = ref(pageSize);

  const visible = computed(() => all.value.slice(0, displayLimit.value));
  const hasMore = computed(() => all.value.length > displayLimit.value);

  function loadMore() {
    displayLimit.value += pageSize;
  }

  // Back to the first page — call when the underlying filter/search changes so
  // the user doesn't stay scrolled deep into a now-different list.
  function reset() {
    displayLimit.value = pageSize;
  }

  return { visible, hasMore, loadMore, reset, displayLimit };
}
