<template>
  <div class="faq-list">
    <div v-for="(faq, i) in items" :key="i" class="faq-item">
      <h3 class="faq-q">{{ faq.q }}</h3>
      <p class="faq-a">{{ faq.a }}</p>
    </div>
  </div>
</template>

<script setup>
// faq-list — a stack of question/answer blocks for About / Help surfaces.
// Generic + presentational: the consuming app supplies the content. Pair with a
// <section-group> above it for the "Common questions" label.
//
//   items: [{ q, a }]   q — the question, a — the answer (plain text)

defineProps({
  items: { type: Array, required: true },
});
</script>

<style lang="scss">
.faq-list .faq-item {
  margin: 0 0 var(--space-5);
}

.faq-list .faq-q {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  margin: 0 0 var(--space-1);
  color: var(--ion-text-color);
}

.faq-list .faq-a {
  margin: 0;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--ion-color-medium-shade);
}
</style>
