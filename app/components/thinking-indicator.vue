<template>
  <span
    class="thinking-indicator"
    role="status"
    aria-live="polite"
    :aria-label="message || 'Working…'">
    <span class="thinking-indicator-dots" aria-hidden="true">
      <span class="thinking-indicator-dot" />
      <span class="thinking-indicator-dot" />
      <span class="thinking-indicator-dot" />
    </span>
    <span v-if="message" class="thinking-indicator-message">{{ message }}</span>
  </span>
</template>

<script setup>
// Three pulsing dots with an optional caption — the "thinking" indicator
// for any in-flight wait (AI replies, polled jobs, slow loads). Generic
// primitive: it animates and renders copy, but says nothing about what's
// loading. Callers pass a contextual `message` (and rotate it themselves
// while the real work runs — see useThinkingMessage in consuming apps).
//
//   <thinking-indicator :message="'Reflecting on what you shared…'" />
//
// Omit `message` for a bare typing indicator (e.g. a chat bubble where the
// surrounding bubble already supplies the context).

defineProps({
  message: { type: String, default: '' },
});
</script>

<style scoped>
.thinking-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.thinking-indicator-dots {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.thinking-indicator-dot {
  width: 0.4rem;
  height: 0.4rem;
  background: var(--ion-color-medium);
  border-radius: 50%;
  animation: thinking-indicator-pulse 1.2s infinite ease-in-out;
}

.thinking-indicator-dot:nth-child(2) { animation-delay: 0.2s; }
.thinking-indicator-dot:nth-child(3) { animation-delay: 0.4s; }

.thinking-indicator-message {
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--ion-color-medium-shade);
}

@keyframes thinking-indicator-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1); }
}

/* Respect reduced-motion: hold the dots steady rather than pulsing. */
@media (prefers-reduced-motion: reduce) {
  .thinking-indicator-dot { animation: none; opacity: 0.6; }
}
</style>
