<template>
  <ion-avatar>
    <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user?.name ?? user?.email ?? ''" loading="lazy" />
    <ion-icon v-else :icon="personCircle" style="font-size: 2rem;"></ion-icon>
  </ion-avatar>
</template>

<script setup>
import { personCircle } from 'ionicons/icons';
// User avatar with a person-circle ionicon fallback when no uploaded photo
// exists. Pass any object with an optional `avatar_url` field — works with
// joined user rows (`r.user`), top-level user records, or `member.users`
// shapes. Used in friends/groups lists, social-activity rows, share lists.
//
//   <user-avatar slot="start" :user="r.user" />
//
// `slot="start"` (and other HTML attrs) pass through to the root
// `<ion-avatar>` via Vue 3's default inheritAttrs behavior, so callers
// can position the avatar inside `<ion-item>` without extra wrapping.

defineProps({
  user: { type: Object, default: null },
});
</script>
