<template>
  <swiper
    :modules="modules"
    :pagination="pagination ? { clickable: true } : false"
    :slides-per-view="1"
    :space-between="0"
    @swiper="onSwiper"
    @slideChange="onSlideChange">
    <slot></slot>
  </swiper>
</template>

<!--
  slides-pager — Swiper wrapper for one-at-a-time paged content with
  optional clickable pagination dots. Used for onboarding flows, badge
  reveals, image galleries — anywhere a user swipes through a sequence
  of full-width pages.

  Ionic deprecated <ion-slides> in favour of Swiper.js; this component
  is the recommended replacement when you want a paged (slides-per-view=1)
  experience. For multi-visible horizontal scrolling use `<slides-bar>`.

  Props:
    pagination {Boolean} - show clickable dots (default: true)

  Emits:
    swiper      - Swiper instance on init
    slideChange - Swiper instance when active slide changes

  Slots:
    default - <swiper-slide> elements. The caller is responsible for
              importing { SwiperSlide } from 'swiper/vue' — matches the
              `slides-bar` convention.

  Example:
    <script setup>
    import { SwiperSlide } from 'swiper/vue';
    </script>
    <slides-pager :pagination="items.length > 1">
      <swiper-slide v-for="item in items" :key="item.id">
        <my-slide-card :item="item" />
      </swiper-slide>
    </slides-pager>
-->

<script setup>
import { Swiper } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

defineProps({
  pagination: { type: Boolean, default: true },
});

const emit = defineEmits(['swiper', 'slideChange']);
const modules = [Pagination];

function onSwiper(swiper)      { emit('swiper', swiper); }
function onSlideChange(swiper) { emit('slideChange', swiper); }
</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background: var(--ion-color-medium);
  opacity: 0.4;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--ion-color-primary);
  opacity: 1;
}
</style>
