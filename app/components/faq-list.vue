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

<style scoped>
.faq-item {
  margin: 0 0 1.25rem;
}

.faq-q {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--ion-text-color);
}

.faq-a {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ion-color-medium-shade);
}
</style>
