<template>
  <ion-searchbar :type="type" 
    :inputmode="inputmode" :enterkeyhint="enterkeyhint"
    :debounce="debounce" :showCancelButton="showCancelButton"
    :autocorrect="autocorrect" :autocomplete="autocomplete" 
    :value="search" :placeholder="placeholder" 
    v-on:keyup.enter="onSearch"></ion-searchbar>
</template>

<script setup>

const props = defineProps({
  search: {
    type: String,
    default: ""
  },
  debounce: {
    type: Number,
    default: 250
  },
  placeholder: {
    type: String,
    default: "Search..."
  },
  type: {
    type: String,
    default: "search"
  },
  inputmode: {
    type: String,
    default: "search"
  },
  autocorrect: {
    type: String,
    default: "off"
  },
  autocomplete: {
    type: String,
    default: "off"
  },
  enterkeyhint: {
    type: String,
    default: "search"
  },
  showClearButton: {
    type: String,
    default: "never"
  },
  showCancelButton: {
    type: String,
    default: "never"
  },
});

const emits = defineEmits([
  "changed"
]);

const onSearch = (event) => {
  if (event && event.target) {
    emits("changed", event.target.value);
  }
}
</script>

<style scoped lang="scss">
</style>