<template>
  <div class="ion-padding ion-text-center profile-header">
    <slot name="avatar">
      <user-avatar :user="user" />
    </slot>
    <section-title v-if="user">{{ user.name ?? user.email }}</section-title>
    <ion-badge
      v-if="planLabel"
      :color="planPaid ? 'warning' : 'medium'"
      class="profile-header-badge">
      {{ planLabel }}
    </ion-badge>
  </div>
</template>

<!--
  profile-header — avatar + name + optional plan badge, centered at the
  top of a profile-style page. Generic across the suite; apps customise
  the avatar by overriding the `#avatar` slot (AnyLearn passes
  <avatar-upload> for tap-to-change behavior; read-only consumers can
  rely on the default <user-avatar>).

  Typical use:

    <profile-header
      :user="profile"
      :plan-label="planLabel"
      :plan-paid="isPaid">
      <template #avatar>
        <avatar-upload :user="profile" @updated="onAvatarUpdated" />
      </template>
    </profile-header>

  Or simplest (read-only avatar, no plan badge):

    <profile-header :user="profile" />
-->

<script setup>
defineProps({
  // The user object — read for the display name / email fallback and
  // forwarded to the default <user-avatar>. The #avatar slot can ignore
  // this and render whatever it needs.
  user: { type: Object, default: null },
  // Optional plan badge text. Hidden entirely when not set.
  planLabel: { type: String, default: null },
  // Drives the badge color: true → warning (paid), false → medium (free).
  planPaid: { type: Boolean, default: false },
});
</script>

