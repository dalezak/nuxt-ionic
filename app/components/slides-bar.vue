<template>
  <swiper
    :slides-per-view="slidesPerView"
    :space-between="spaceBetween"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <slot></slot>
  </swiper>
</template>

<!--
  slides-bar — Swiper wrapper with configurable slides-per-view and spacing.

  Props:
    slidesPerView {Number} - number of slides visible at once (default: 3)
    spaceBetween  {Number} - gap between slides in px (default: 50)

  Emits:
    swiper      - forwarded from Swiper; payload is the Swiper instance
    slideChange - forwarded from Swiper; payload is the Swiper instance

  Slots:
    default - <swiper-slide> elements
-->
<script setup>
import { Swiper } from 'swiper/vue';
import 'swiper/css';

const props = defineProps({
  slidesPerView: {
    type: Number,
    default: 3
  },
  spaceBetween: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(['swiper', 'slideChange']);

function onSwiper(swiper) {
  emit('swiper', swiper);
}

function onSlideChange(swiper) {
  emit('slideChange', swiper);
}
</script>

<style scoped lang="scss">

</style>
