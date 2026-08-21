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

