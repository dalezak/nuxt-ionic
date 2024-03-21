<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isApp">
      <ion-toolbar>
        <ion-title v-if="isSignup">Signup</ion-title>
        <ion-title v-else-if="isLogin">Login</ion-title>
        <ion-title v-else-if="isReset">Reset Password</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-sm="12" size-md="10" size-lg="8" size-xl="6">
            <ion-card class="ion-margin">
              <ion-card-header>
                <ion-card-title v-if="isSignup">Welcome</ion-card-title>
                <ion-card-title v-else-if="isLogin">Welcome back</ion-card-title>
                <ion-card-title v-else-if="isReset">Forgot password</ion-card-title>
                <ion-card-subtitle v-if="isSignup">Enter your name, email, and password</ion-card-subtitle>
                <ion-card-subtitle v-else-if="isLogin">Enter your email and password</ion-card-subtitle>
                <ion-card-subtitle v-else-if="isReset">Enter your email</ion-card-subtitle>
              </ion-card-header>
              <ion-item lines="inset" v-if="isSignup">
                <ion-input label="Name" label-placement="floating" ref="nameInput" v-model="name" type="text" :required="isSignup" v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin || isReset">
                <ion-input label="Email" label-placement="floating" ref="emailInput" v-model="email" type="text" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin">
                <ion-input label="Password" label-placement="floating" ref="passwordInput" v-model="password" type="password" :required="isSignup || isLogin" v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-card-content>
                <ion-row>
                  <ion-col class="ion-no-padding ion-text-end">
                    <ion-button fill="solid" @click="doSignup" v-if="isSignup">Signup</ion-button>
                    <ion-button fill="solid" @click="doLogin" v-else-if="isLogin">Login</ion-button>
                    <ion-button fill="solid" @click="doReset" v-else-if="isReset">Email Instructions</ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
            <ion-card class="ion-margin">
              <ion-card-content>
                <ion-button fill="clear" @click="loginForm" v-if="isSignup || isReset">Already have an account?</ion-button>
                <ion-button fill="clear" @click="signupForm" v-if="isLogin || isReset">Don't have an account?</ion-button>
                <ion-button fill="clear" @click="resetForm" v-if="isLogin">Forgot your password?</ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp } = usePlatform();

const name = ref("");
const nameInput = ref(null);

const email = ref("");
const emailInput = ref(null);

const password = ref("");
const passwordInput = ref(null);

const form = ref("login");

let isLogin = computed(() => form.value == "login");
let isSignup = computed(() => form.value == "signup");
let isReset = computed(() => form.value == "reset");

const { userLogin, userSignup, resetPassword } = useUsersStore();
  
function loginForm() {
  form.value = "login";
}

function signupForm() {
  form.value = "signup";
}

function resetForm() {
  form.value = "reset";
}

function hasName() {
  return hasInput(nameInput.value, name.value, "Please enter your name");
}

function hasEmail() {
  return hasInput(emailInput.value, email.value, "Please enter your email");
}

function hasPassword() {
  return hasInput(passwordInput.value, password.value, "Please enter your password");
}

function onEnter() {
  if (isSignup && hasName() && hasEmail() && hasPassword()) {
    doSignup();
  }
  else if (isLogin && hasEmail() && hasPassword()) {
    doLogin();
  }
  else if (isReset && hasEmail()) {
    doReset();
  }
}

async function doLogin() {
  if (hasEmail() && hasPassword()) {
    try {
      showLoading("Logging in...");
      let user = await userLogin({
        email: email.value, 
        password: password.value
      });
      if (user) {
        showToast("Welcome back friend");
        clearInputs();
        showPageIndex();
      }
      else {
        showAlert("Problem Logging In", "Please enter your credentials and try again.");
      }
    }
    catch (error) {
      consoleError("doLogin", error);
      showAlert("Problem Logging In", error);
    }
    finally {
      hideLoading();
    }
  }
}

async function doSignup() {
  if (hasName() && hasEmail() && hasPassword()) {
    try {
      showLoading("Signing up...");
      let user = await userSignup({
        name: name.value,
        email: email.value,
        password: password.value
      });
      if (user) {
        showToast("Welcome friend");
        clearInputs();
        showPageIndex();
      }
      else {
        showAlert("Problem Signing In", "Please enter your information and try again.");
      }
    }
    catch (error) {
      consoleError("doSignup", error);
      showAlert("Problem Signing Up", error);
    }
    finally {
      hideLoading();
    }
  }
}

async function doReset() {
  if (hasEmail()) {
    try {
      await resetPassword({
        email: email.value
      });
      showAlert("Password Reset", "Please check your email for instructions to reset your password.");
    }
    catch (error) {
      consoleError("doReset", error);
      showAlert("Problem Resetting Password", error);
    }
    finally {
      hideLoading();
    }
  }
}

function clearInputs() {
  name.value = "";
  email.value = "";
  password.value = "";
}
</script>

<style scoped>
</style>
