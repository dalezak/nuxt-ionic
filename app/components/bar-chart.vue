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

<style scoped>
.bar-chart {
  padding: 0.5rem 0 1.5rem;
}
.empty,
.not-attempted {
  color: var(--ion-color-medium);
  font-style: italic;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.5rem 0;
}
.group-card {
  margin: 0.75rem 1rem;
}
.group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}
.group-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--ion-text-color);
  flex: 1;
}
.group-content {
  padding-top: 0;
}
.bar-row {
  display: grid;
  grid-template-columns: 64px 1fr 48px;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 0;
  font-size: 0.8rem;
}
.bar-name {
  font-weight: 600;
  color: var(--bar-color, var(--ion-color-medium-shade));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.is-highlight .bar-name {
  color: var(--ion-color-primary);
  font-weight: 700;
}
.bar-track {
  height: 10px;
  background: var(--ion-color-light-shade);
  border-radius: 5px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--bar-color, var(--ion-color-medium));
  border-radius: 5px;
  transition: width 0.3s ease;
}
.is-highlight .bar-fill {
  background: var(--ion-color-primary);
}
.bar-score {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--bar-color, var(--ion-color-medium-shade));
  text-align: right;
}
.is-highlight .bar-score {
  color: var(--ion-color-primary);
}
</style>
