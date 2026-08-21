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

