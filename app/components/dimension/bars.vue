<template>
  <div class="dim-bars">
    <!-- Nothing scored yet anywhere — a friendly nudge instead of a wall of
         empty bars (which reads as broken / still loading). -->
    <p v-if="!hasAnyScore" class="db-empty">{{ emptyText }}</p>

    <!-- Single column — a compact bar per item: item label + bar + value, no
         redundant per-row name. (A one-scope snapshot.) -->
    <template v-else-if="isSingle">
      <div v-for="item in items" :key="item.key" class="db-row db-row--solo">
        <span class="db-name db-name--wide">{{ item.label }}</span>
        <span class="db-track">
          <span
            v-if="soloScore(item) != null"
            class="db-fill"
            :style="soloFillStyle(item)"></span>
        </span>
        <span class="db-val" :class="{ 'db-val--empty': soloScore(item) == null }">
          {{ soloScore(item) ?? '·' }}
        </span>
      </div>
    </template>

    <!-- Multiple columns — one block per item; inside, a horizontal bar per
         column (an optional emoji + label per row). The grouped "all at once"
         comparison read. -->
    <template v-else>
      <div v-for="item in items" :key="item.key" class="db-item">
        <p class="db-item-label">{{ item.label }}</p>
        <div v-for="col in columns" :key="(col.key ?? 'overall') + '-' + item.key" class="db-row">
          <span class="db-name">
            <span v-if="col.emoji" class="db-emoji">{{ col.emoji }}</span>
            <span class="db-name-text">{{ col.label }}</span>
          </span>
          <span class="db-track">
            <span
              v-if="scoreOf(col, item) != null"
              class="db-fill"
              :style="fillStyle(col, item)"></span>
          </span>
          <span class="db-val" :class="{ 'db-val--empty': scoreOf(col, item) == null }">
            {{ scoreOf(col, item) ?? '·' }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// Bar chart (nuxt-ionic) — per-item horizontal bars, the bar-shaped sibling of
// <wheel-chart>. `items` are the rows (categories); `columns` are the series.
// With ONE column it renders a compact per-item snapshot (label + bar + value);
// with several it groups a bar per column under each item — the "all at once"
// comparison read. Bar length = score / max. Generic + presentational: any app
// passes its own catalog (pillars, virtues, capacities, …) + scored columns; an
// `emptyText` shows when nothing is scored. The meaning/framing lives in the
// caller's surrounding copy.

const props = defineProps({
  // Row catalog: [{ key, label, color }].
  items: { type: Array, required: true },
  // Series: [{ key, label, emoji?, scores: { [itemKey]: score } }].
  columns: { type: Array, required: true },
  max: { type: Number, default: 5 },
  // Shown when nothing is scored yet (no score in any column/item).
  emptyText: { type: String, default: 'Nothing rated yet.' },
});

const isSingle = computed(() => props.columns.length === 1);

// True once any item in any column has a numeric score — gates the empty state.
const hasAnyScore = computed(() =>
  props.columns.some(col =>
    props.items.some(item => typeof col?.scores?.[item.key] === 'number'),
  ),
);

function scoreOf(col, item) {
  const s = col?.scores?.[item.key];
  return typeof s === 'number' ? s : null;
}

function fillStyle(col, item) {
  const score = scoreOf(col, item);
  if (score == null) return {};
  const color = item.color || 'var(--ion-color-primary)';
  return { width: `${(score / props.max) * 100}%`, background: color };
}

// Single-column convenience wrappers — read the lone column.
function soloScore(item) {
  return scoreOf(props.columns[0], item);
}
function soloFillStyle(item) {
  return fillStyle(props.columns[0], item);
}
</script>

<style scoped>
.db-empty {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--ion-color-medium-shade);
}

.db-item {
  margin: 0 0 1rem;
}

.db-item-label {
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ion-text-color);
}

.db-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.3rem;
}

/* Solo rows sit flush (no per-item heading above them). */
.db-row--solo {
  margin: 0 0 0.5rem;
}

.db-name {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex: 0 0 5.5rem;
  min-width: 0;
  font-size: 0.78rem;
  color: var(--ion-color-medium-shade);
}

/* Wider column for the solo view, where the label is the item name
   ("Interdependence") rather than a short series name. */
.db-name--wide {
  flex-basis: 8rem;
  font-weight: 500;
  color: var(--ion-text-color);
}

.db-emoji {
  font-size: 0.85rem;
  line-height: 1;
  flex-shrink: 0;
}

.db-name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.db-track {
  position: relative;
  flex: 1 1 auto;
  height: 0.6rem;
  border-radius: 999px;
  background: var(--ion-color-light);
  overflow: hidden;
}

.db-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 999px;
  opacity: 0.85;
  transition: width 200ms ease;
}

.db-val {
  flex: 0 0 1rem;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ion-text-color);
  opacity: 0.75;
}

.db-val--empty {
  font-weight: 400;
  opacity: 0.4;
}
</style>
