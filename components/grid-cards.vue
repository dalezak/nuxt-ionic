<template>
  <div class="grid-cards ion-margin-vertical">
    <masonry :resolve-slot="true" :cols="cols" :gutter="gutter">
      <slot></slot>
    </masonry>
    <transition name="fade" mode="out-in">
      <ion-button :disabled="loading" color="primary" expand="block" fill="outline" class="ion-margin" @click="onMore" v-if="limit > 0 && count > 0 && count%limit==0">
        <span v-if="loading">Loading...</span>
        <span v-else>Load More</span>
      </ion-button>
    </transition>
    <transition appear name="fade" mode="out-in">
      <ion-card class="ion-margin" v-if="loading == false && count == 0 && limit > 0">
        <ion-card-header>
          <ion-card-subtitle v-if="search && search.length > 0">There are no {{label}} matching "{{search}}".</ion-card-subtitle>
          <ion-card-subtitle v-else>It doesn't look like there are any {{label}} yet.</ion-card-subtitle>
        </ion-card-header>
      </ion-card>
    </transition>
  </div>
</template>
<script setup>
const props = defineProps({
  gutter: {
    type: Object,
    default: () => ({
      default: "0px"
    })
  },
  xs: {
    type: Number,
    default: 1
  },
  sm: {
    type: Number,
    default: 1
  },
  md: {
    type: Number,
    default: 2
  },
  lg: {
    type: Number,
    default: 3
  },
  xl: {
    type: Number,
    default: 4
  },
  limit: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: "items"
  },
  search: {
    type: String,
    default: ""
  }
})

const emit = defineEmits([
  "more"
])

const cols = {
  default: props.sm,
  320: props.xs,
  576: props.sm,
  768: props.md,
  992: props.lg,
  1200: props.xl
}

function onMore(event) {
  event.stopPropagation();
  emit('more');
}
</script>

<style scoped lang="scss">

</style>