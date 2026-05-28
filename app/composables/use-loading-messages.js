// Rotates loading-overlay text every `intervalMs` while a long-running
// task is in flight. Apps pass the message list at start time; the
// composable handles the showLoading/hideLoading lifecycle.
//
// Typical use:
//
//   const { start, stop } = useLoadingMessages();
//   start([
//     "Designing your curriculum...",
//     "Crafting quiz questions...",
//   ]);
//   try { await someLongTask(); }
//   finally { stop(); }
//
// `pause()` keeps the overlay visible but stops cycling — useful when you
// know the task has progressed and want to lock the message; `stop()`
// dismisses the overlay entirely.

// Default cycle: each message stays up for 4 seconds before the next one
// rotates in. Slow enough to read; fast enough to feel like work is
// progressing on multi-step AI calls.
const DEFAULT_ROTATION_INTERVAL_MS = 4000;

export function useLoadingMessages() {
  let intervalId = null;

  function start(messages, { intervalMs = DEFAULT_ROTATION_INTERVAL_MS } = {}) {
    pause();
    if (!messages?.length) return;
    let index = 0;
    showLoading(messages[index]);
    intervalId = setInterval(() => {
      index = (index + 1) % messages.length;
      showLoading(messages[index]);
    }, intervalMs);
  }

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function stop() {
    pause();
    hideLoading();
  }

  return { start, pause, stop };
}
