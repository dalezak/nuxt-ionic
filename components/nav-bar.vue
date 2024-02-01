<template>
  <ion-toolbar v-show="visible">
    <ion-title>{{ title }}</ion-title>
    <ion-buttons slot="end">
      <ion-button @click="showPage(tab.path, false)" :title="tab.label" :key="tab.name" v-for="tab of appTabs">
        <template v-if="tab.label">{{ tab.label }}</template>
        <template v-else-if="tab.icon">
          <ion-icon :icon="getIcon(tab.icon)" />
        </template>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  public: {
    type: Boolean,
    default: true
  },
  tabs: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  }
});
const appTabs = computed(() => props.tabs.filter(tab => tab.public == props.public));
</script>

<style scoped lang="scss">

</style>