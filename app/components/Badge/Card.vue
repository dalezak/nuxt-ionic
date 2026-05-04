<template>
  <div class="badge-card" :class="{ locked }">
    <div class="badge-icon">{{ locked ? '🔒' : emoji }}</div>
    <div class="badge-text">
      <div class="badge-name">{{ label }}</div>
      <div v-if="badge?.description" class="badge-desc">{{ badge.description }}</div>
    </div>
  </div>
</template>

<script setup>
// BadgeCard — display a single badge as a horizontal card with an emoji /
// lock icon and label. Extracts the trailing emoji from the badge `name`
// if present (badges seeded as "First Step 👣" → emoji '👣', label 'First Step').
//
// Pass `locked` to render the un-earned state.

const props = defineProps({
  badge: { type: Object, required: true },
  locked: { type: Boolean, default: false },
});

const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})[️⃣]?$/u;
const emoji = computed(() => props.badge?.name?.match(emojiRegex)?.[0] ?? '🏅');
const label = computed(() => props.badge?.name?.replace(emojiRegex, '').trim() ?? '');
</script>

<style scoped>
.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--ion-color-light);
  border-left: 4px solid var(--ion-color-warning);
  margin-bottom: 8px;
}

.badge-card.locked {
  opacity: 0.45;
  border-left-color: var(--ion-color-medium);
}

.badge-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.badge-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.badge-desc {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  margin-top: 2px;
}
</style>
