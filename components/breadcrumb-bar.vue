<template>
  <transition appear name="fade" mode="out-in">
    <ion-card>
      <ion-grid>
        <ion-row>
          <ion-col v-if="breadcrumbs && breadcrumbs.length > 0">
            <ion-breadcrumbs>
              <ion-breadcrumb :title="breadcrumb.label" @click="popPage(breadcrumb.path)" 
                :key="breadcrumb.name" v-for="breadcrumb of breadcrumbs">{{ breadcrumb.label }}</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
          <ion-col size="6" size-md="4" size-lg="3" v-if="hasSearch">
            <ion-searchbar :type="type" :value="search" :placeholder="placeholder" @ionInput="doSearch"
              :inputmode="inputmode" :autocorrect="autocorrect" :enterkeyhint="enterkeyhint"></ion-searchbar>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  },
  search: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "Search..."
  },
  onSearch: {
    type: Function
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
  }
});

const hasSearch = props['onSearch'] !== undefined;

function doSearch(event) {
  consoleLog("doSearch", event);
  if (props.onSearch) {
    props.onSearch(event.target.value);
  }
}
</script>

<style scoped lang="scss">
.sc-ion-searchbar-md-h {
  --box-shadow: none !important;
  border-radius: 5px !important;
  border: 1px solid var(--ion-color-light) !important;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-inline-start: 0px;
  padding-inline-end: 0px;
}
ion-breadcrumb {
  cursor: pointer;
}
</style>