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

<!--
  share-popover — Ionic popover listing social share actions.

  Props:
    title       {String}  - share title passed to each share handler
    description {String}  - share body/description (default: "")
    url         {String}  - URL to share (default: "")
    image       {String}  - image URL to include in share (default: "")
    facebook    {Boolean} - show Facebook option (default: true)
    twitter     {Boolean} - show Twitter option (default: true)
    linkedin    {Boolean} - show LinkedIn option (default: true)
    pinterest   {Boolean} - show Pinterest option (default: true)
    email       {Boolean} - show Email option (default: true)

  Slots: none
  Emits: none
-->
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

const properties = computed(() => ({
  title: props.title,
  description: props.description,
  image: props.image,
  url: props.url
}))
</script>

<style lang="scss" scoped>

</style>