<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Reset Password</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <page-content>

        <section-card
          title="Change password"
          subtitle="Enter your new password">
          <ion-input type="password" autocapitalize="off" autocorrect="off" spellcheck="false" label="Password" label-placement="floating" mode="md" fill="outline" ref="state.passwordInput" v-model="state.password" required></ion-input>
          <template #footer>
            <div class="ion-text-end">
              <ion-button fill="solid" @click="doUpdate">Update Password</ion-button>
            </div>
          </template>
        </section-card>

      </page-content>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const state = reactive({
  password: "",
  passwordInput: null
});

const usersStore = useUsersStore();

function hasPassword() {
  return hasInput(state.passwordInput, state.password, "Please enter your password");
}

async function doUpdate() {
  if (hasPassword()) {
    try {
      await usersStore.updatePassword({
        password: state.password
      });
      showAlert("Password Update", "Your password has been updated.");
    }
    catch (error) {
      showAlertError("Problem Updating Password", error);
    }
  }
}
</script>
