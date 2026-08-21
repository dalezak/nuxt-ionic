<template>
  <ion-grid class="ion-no-padding stats-grid">
    <ion-row>
      <ion-col v-for="tile in tiles" :key="tile.key" :size="size" :size-md="sizeMd">
        <stats-card
          class="stats-grid-card"
          :value="tile.value"
          :label="tile.label"
          :icon="tile.icon"
          :color="tile.color"
          :tappable="tile.tappable"
          @click="$emit('tile', tile.key)" />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup>
// A responsive grid of <stats-card> tiles for at-a-glance dashboards (Growth's
// body-of-work counts, and any stat surface in the suite). ion-grid/ion-row/
// ion-col supply the columns; each tile is the shared stats-card (section-card
// underneath, so chrome stays token-driven).
//
// Alignment: the column padding supplies the gutters BETWEEN tiles, and the
// grid pulls itself out by the same amount on every side so the outer tile
// edges sit flush with the page's other cards (which run edge-to-edge inside
// the ion-padding container).
//
// Consumers compute the tiles + route taps. Suggested ethos (see the apps'
// CLAUDE.md): count-only labels, tappable tiles as doorways into the content
// they count. Zero-count tiles can show as invitations (a tappable "0 lessons"
// is a doorway into the surface that awaits) or be filtered — the app's call.
defineProps({
  // [{ key, value, label, icon, color?, tappable? }]
  tiles: { type: Array, default: () => [] },
  // Column widths (out of 12): default 2-across, 3-across on md+.
  size: { type: String, default: '6' },
  sizeMd: { type: String, default: '4' },
});
defineEmits(['tile']);
</script>

