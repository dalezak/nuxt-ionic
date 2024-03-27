<template>
  <ion-content>
    <ion-list>
      <ion-list-header>
        <ion-label>Share via</ion-label>
      </ion-list-header>
      <ion-item button="true" detail="false" @click="doShareEmail" v-if="email">Email</ion-item>
      <ion-item button="true" detail="false" @click="doShareTwitter" v-if="twitter">Twitter</ion-item>
      <ion-item button="true" detail="false" @click="doShareFacebook" v-if="facebook">Facebook</ion-item>
      <ion-item button="true" detail="false" @click="doShareLinkedIn" v-if="linkedin">LinkedIn</ion-item>
      <ion-item button="true" detail="false" @click="doSharePinterest" v-if="pinterest">Pinterest</ion-item>
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
})

function doShareEmail() {
  shareEmail({
    title: props.title,
    description: props.description,
    image: props.image,
    url: props.url
  });
}

function doShareTwitter() {
  shareTwitter({
    title: props.title,
    description: props.description,
    image: props.image,
    url: props.url 
  });
}

function doShareFacebook() {
  shareFacebook({
    title: props.title,
    description: props.description,
    image: props.image,
    url: props.url 
  });
}

function doShareLinkedIn() {
  shareLinkedIn({
    title: props.title,
    description: props.description,
    image: props.image,
    url: props.url
  });
}

function doSharePinterest() {
  sharePinterest({
    title: props.title,
    description: props.description,
    image: props.image,
    url: props.url
  });
}
</script>

<style lang="scss" scoped>

</style>