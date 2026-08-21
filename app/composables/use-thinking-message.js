// Rotates a list of "thinking" captions while an async call is genuinely
// in flight. Honest by construction: the caller invokes start() when the real
// request begins and stop() when the response lands, so the copy only advances
// during a real wait — never as staged delay. The message list is the
// consuming app's editorial (pass it in); this layer owns only the mechanism.
//
//   const { message, start, stop } = useThinkingMessage(MESSAGES);
//   state.sending = true; start();
//   try { await invokeFunction(...); } finally { state.sending = false; stop(); }
//
// `message` is a ref — destructure it so it auto-unwraps in the template.
// A single-item list (or string) shows that one line and never ticks.

export function useThinkingMessage(messages, { intervalMs = 4000 } = {}) {
  const list = (Array.isArray(messages) ? messages : [messages]).filter(Boolean);
  const index = ref(0);
  const message = computed(() => list[index.value % list.length] ?? '');
  let timer = null;

  function start() {
    stop();
    index.value = 0;
    if (list.length <= 1) return; // nothing to rotate through
    timer = setInterval(() => { index.value += 1; }, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Clear the interval if the owning component unmounts mid-flight.
  onScopeDispose(stop);

  return { message, start, stop };
}
