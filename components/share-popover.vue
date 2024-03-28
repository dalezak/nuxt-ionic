<template>
  <ion-content>
    <ion-list>
      <ion-list-header>
        <ion-label>Share via</ion-label>
      </ion-list-header>
      <ion-item button="true" detail="false" @click="shareEmail(properties)" v-if="email">Email</ion-item>
      <ion-item button="true" detail="false" @click="shareTwitter(properties)" v-if="twitter">Twitter</ion-item>
      <ion-item button="true" detail="false" @click="shareFacebook(properties)" v-if="facebook">Facebook</ion-item>
      <ion-item button="true" detail="false" @click="shareLinkedIn(properties)" v-if="linkedin">LinkedIn</ion-item>
      <ion-item button="true" detail="false" @click="sharePinterest(properties)" v-if="pinterest">Pinterest</ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String
  },
  description: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  facebook: {
    type: Boolean,
    default: true
  },
  twitter: {
    type: Boolean,
    default: true
  },
  linkedin: {
    type: Boolean,
    default: true
  },
  pinterest: {
    type: Boolean,
    default: true
  },
  email: {
    type: Boolean,
    default: true
  }
});

const properties = {
  title: props.title,
  description: props.description,
  image: props.image,
  url: props.url
}
</script>

<style lang="scss" scoped>

</style>