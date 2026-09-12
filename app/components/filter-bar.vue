<template>
  <ion-card class="filter-bar">
    <ion-grid>
      <ion-row class="ion-align-items-center" :class="(options?.length || label) ? 'ion-justify-content-between' : 'ion-justify-content-end'">
        <ion-col v-if="label && (!options || options.length === 0)" size="auto">
          <ion-label class="filter-label">{{ label }}</ion-label>
        </ion-col>
        <ion-col v-if="options && options.length > 0" size="auto">
          <ion-select
            :model-value="modelValue"
            interface="popover"
            class="filter-select"
            @update:model-value="$emit('update:modelValue', $event)">
            <ion-select-option
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value">
              {{ opt.label }}
            </ion-select-option>
          </ion-select>
        </ion-col>
        <!-- The searchbar column always FLEXES (size=""), taking whatever the
             label/select column leaves. It used to be size="auto" whenever it
             shared the row, which sizes the column to the input's intrinsic
             width — for an ion-searchbar that is barely wider than its two
             icons, so the field collapsed and a typed query scrolled out of
             sight behind the magnifier. The 260px cap below still keeps it
             sensible on wide screens. -->
        <ion-col v-if="placeholder !== undefined" size="">
          <ion-searchbar
            ref="searchbarEl"
            :model-value="search"
            :placeholder="placeholder"
            :debounce="debounce"
            :show-cancel-button="showCancelButton"
            enterkeyhint="search"
            class="search-bar"
            :class="{ 'search-bar--outline': fill === 'outline', 'search-bar--full': !(options?.length || label) }"
            @update:model-value="$emit('update:search', $event)">
          </ion-searchbar>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: null },
  search: { type: String, default: '' },
  options: { type: Array, default: null },
  label: { type: String, default: null },
  placeholder: { type: String, default: 'Search...' },
  debounce: { type: Number, default: 200 },
  // Searchbar chrome. 'clear' (default) keeps the borderless input that
  // blends into the card; 'outline' draws a 1px ring so the input reads
  // as a distinct field. Done via the searchbar's --box-shadow var so it
  // works in either Ionic mode (ion-searchbar has no `fill` prop itself).
  fill: { type: String, default: 'clear', validator: (v) => ['clear', 'outline'].includes(v) },
  // Ionic's own Cancel button — 'never' (default), 'focus' (appears while
  // typing), or 'always'.
  //
  // NOT a keyboard-dismiss control: Cancel CLEARS the query, which on a results
  // page throws away what the user just searched for. Reach for it only where
  // abandoning the search is the intended action. To put the keyboard away
  // while keeping the results, blur on scroll at the page level instead.
  showCancelButton: {
    type: String,
    default: 'never',
    validator: (v) => ['never', 'focus', 'always'].includes(v),
  },
});

const emit = defineEmits(['update:modelValue', 'update:search', 'submit']);

// Return/Enter means "I'm done typing" — put the keyboard away and leave the
// query alone. Search here is always debounced-live, so there is nothing to
// submit; the only thing Enter should do is get the keyboard off the results.
//
// Blur the INNER input, not the host: keydown crosses the shadow boundary so
// `event.target` is retargeted to <ion-searchbar>, which has no focus to lose.
// `getInputElement()` is Ionic's own accessor for the real <input> — the
// supported way in rather than reaching through the shadow root.
//
// `enterkeyhint="search"` above labels the key accordingly on iOS/Android.
// Listeners go on the REAL <input>, resolved through Ionic's getInputElement().
//
// A `@keydown.enter` binding on <ion-searchbar> is the obvious version and it
// is not reliable: the searchbar is a web component, keydown crosses the shadow
// boundary retargeted to the host, and whether the listener fires at all
// depends on Vue's attribute fallthrough reaching a custom element. Attaching
// to the input itself removes every one of those questions.
//
// Two events, because soft keyboards differ: most fire `keydown` with
// key === 'Enter', while iOS's Search key on a type=search input fires the
// `search` event and may not deliver a keydown at all.
const searchbarEl = ref(null);
let inputEl = null;

function onEnterKey(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  onEnter();
}

function onEnter() {
  inputEl?.blur();
  emit('submit');
}

onMounted(async () => {
  const host = searchbarEl.value?.$el ?? searchbarEl.value;
  inputEl = (await host?.getInputElement?.()) ?? null;
  if (!inputEl) return;
  inputEl.addEventListener('keydown', onEnterKey);
  inputEl.addEventListener('search', onEnter);
});

onBeforeUnmount(() => {
  inputEl?.removeEventListener('keydown', onEnterKey);
  inputEl?.removeEventListener('search', onEnter);
  inputEl = null;
});
</script>

<style lang="scss">
.filter-bar {
  margin: 0 0 var(--space-4);
}
.filter-bar .filter-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  padding-left: var(--space-1);
}
.filter-bar .filter-select {
  font-size: var(--text-sm);
  --padding-start: 0.25rem;
}
.filter-bar .search-bar {
  --box-shadow: none;
  --background: transparent;
  padding-top: 0;
  padding-bottom: 0;
  /* Fill the column, then cap. Without the width an ion-searchbar sits at its
     intrinsic width — about two icons wide — so a shared row rendered a field
     too narrow to read the query back in. */
  width: 100%;
  max-width: 260px;
}
/* Search-only bar: fill the card width instead of capping at 260px, so the
   input (and its outline ring) spans the row rather than shrinking to the
   icon. */
.filter-bar .search-bar--full {
  max-width: none;
  width: 100%;
}

/* Outline variant — a 1px inset ring via the searchbar's --box-shadow
   var (works in either Ionic mode, no `fill` prop on ion-searchbar).
   Colour + radius mirror Ionic's MD `fill="outline"` defaults
   (--ion-color-step-300 border, 4px radius) so the field matches the
   app's other outlined inputs (e.g. the reflection textareas). */
.filter-bar .search-bar--outline {
  --box-shadow: inset 0 0 0 1px var(--ion-color-step-300, #b3b3b3);
  --border-radius: 4px;
  --background: var(--ion-background-color, #fff);
}
</style>
