// withLoading — wraps a load function with the standard `state.loading`
// flag + try/catch/finally + error logging pattern that every page's
// `loadData()` function repeats verbatim.
//
// Mutates `state.loading` rather than owning its own ref so templates
// can keep `v-if="state.loading"` exactly as they were — refactoring
// existing pages doesn't touch the template, just the script.
//
// Usage:
//   async function loadData() {
//     await withLoading(state, 'page-label', async () => {
//       // ... load logic that mutates state.*
//     });
//   }
//
// Errors are logged with the page label as prefix (matches the existing
// per-page `consoleError('page-label loadData', error)` convention) and
// swallowed — `state.loading` is always reset, so the page never sticks
// in a loading state on a thrown error.

export default async function withLoading(state, label, loadFn) {
  state.loading = true;
  try {
    await loadFn();
  } catch (error) {
    consoleError(`${label} loadData`, error);
  } finally {
    state.loading = false;
  }
}
