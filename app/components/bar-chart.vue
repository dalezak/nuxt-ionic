<template>
  <div class="bar-chart">
    <div v-if="!groups.length" class="empty">
      <slot name="empty">No data.</slot>
    </div>
    <ion-card v-for="group in groups" :key="group.id" class="group-card">
      <ion-card-header class="group-header">
        <ion-card-title class="group-title">{{ group.title }}</ion-card-title>
        <slot name="status" :group="group" :status="group.status"></slot>
      </ion-card-header>
      <ion-card-content class="group-content">
        <div v-if="(group.rows ?? []).length > 0">
          <div
            v-for="(row, i) in group.rows"
            :key="row.id ?? i"
            class="bar-row"
            :class="{ 'is-highlight': row.highlight }"
            :style="{ '--bar-color': row.highlight ? null : row.color }">
            <span class="bar-name">{{ row.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: pct(row) + '%' }"></div>
            </div>
            <span class="bar-score">
              <slot name="rowEnd" :row="row">{{ row.value }}/{{ row.total }}</slot>
            </span>
          </div>
        </div>
        <div v-else class="not-attempted">
          <slot name="rowsEmpty" :group="group">No data for this group.</slot>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup>
// Horizontal-bar comparison chart grouped by section. Each `group` carries
// a title, optional `status` metadata (rendered by callers via the `status`
// slot), and a `rows` array. Each row is `{ id?, label, value, total,
// color?, highlight? }` — the bar fills `value / total` percent, the
// `label` and bar tint to `color` (CSS color string) when set, and
// `highlight: true` switches to the primary/themed look (used for a
// "You" row or any focal row).
//
// Sibling of `<wheel-chart>` — both are pure presentational components
// that take a normalized data shape. Apps own the transform from their
// domain data (user_ids → palette colors, lesson statuses, etc.) into
// the `groups` shape.

defineProps({
  groups: { type: Array, default: () => [] },
});

function pct(row) {
  if (!row?.total) return 0;
  return Math.round((row.value / row.total) * 100);
}
</script>

