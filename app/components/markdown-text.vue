<!--
  markdown-text — renders a small Markdown subset (see utils/markdown-lite).

    <markdown-text :text="entry.content" />

  For user-authored prose: journal entries, reflections, notes. The text is
  HTML-escaped before any markup is introduced, so `v-html` here is fed only the
  fixed whitelist of tags the renderer emits — never anything the user wrote.

  Typography stays close to the surrounding body copy; this is someone's writing,
  not a document. Lists keep their markers, bold reads as emphasis rather than
  shouting, and headings are one step up from body rather than page-scale.
-->

<template>
  <div class="markdown-text" v-html="html" />
</template>

<script setup>
import markdownLite from '../utils/markdown-lite';

const props = defineProps({
  text: { type: String, default: '' },
});

const html = computed(() => markdownLite(props.text));
</script>

<style lang="scss">
.markdown-text {
 font-size: var(--text-base);
 line-height: var(--leading-normal);
 color: var(--ion-text-color);
}

.markdown-text p {
 margin: 0 0 var(--space-3);
}

.markdown-text p:last-child,
.markdown-text ul:last-child,
.markdown-text ol:last-child {
 margin-bottom: 0;
}

.markdown-text h2,
.markdown-text h3 {
 font-size: var(--text-base);
 font-weight: var(--weight-bold);
 line-height: var(--leading-tight);
 margin: var(--space-4) 0 var(--space-2);
}

.markdown-text h2:first-child,
.markdown-text h3:first-child {
 margin-top: 0;
}

.markdown-text ul,
.markdown-text ol {
 margin: 0 0 var(--space-3);
 padding-inline-start: 1.25rem;
}

.markdown-text li {
 margin: 0.15rem 0;
}

.markdown-text strong {
 font-weight: var(--weight-bold);
}

.markdown-text code {
 font-size: 0.9em;
 padding: 0.05rem var(--space-1);
 border-radius: 0.3rem;
 background: var(--ion-color-step-50, #f5f5f5);
}

.markdown-text a {
 color: var(--ion-color-primary);
}
</style>
