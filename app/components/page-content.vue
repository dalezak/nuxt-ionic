<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-sm="11" size-md="9" size-lg="7" size-xl="6">
        <slot />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<!--
  page-content — centered, width-constrained content column for top-level
  tab pages. Mirrors the per-page ion-grid / ion-row / ion-col pattern
  apps used inline before this primitive existed, so the suite reads as
  one product across best-self / love-well / any-learn.

  Sizes:
    xs (<576px)        → 12/12 (full width)
    sm (≥576px)        → 11/12
    md (≥768px)        → 9/12
    lg (≥992px)        → 7/12
    xl (≥1200px)       → 6/12

  Usage:
    Wrap the body of an <ion-content> with this component. Keep slot="fixed"
    elements (page-refresher, ion-fab) OUTSIDE the wrapper so they pin to
    the viewport, not the centered column.

      <ion-content :fullscreen="true">
        <page-refresher slot="fixed" :load="loadData" />
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">…</ion-fab>
        <page-content>
          [all the cards / lists / etc.]
        </page-content>
      </ion-content>
-->
