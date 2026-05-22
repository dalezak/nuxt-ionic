// Navigate to a top-level tab page. Wraps `showPage(path, false, true)` —
// the `root=true` flag tells the Ionic router this is a tab-root navigation
// (not a stack push) so back-buttons drop the current stack rather than
// returning to the previous page. Client-only via the underlying `showPage`.
export default function (path) {
  if (import.meta.client) {
    showPage(path, false, true);
  }
}
