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

export function useLoadingMessages() {
  let intervalId = null;

  function start(messages, { intervalMs = 4000 } = {}) {
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
