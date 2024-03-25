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
                <ion-input type="text" label="Name" label-placement="floating" ref="state.nameInput" v-model="state.name" :required="isSignup" v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin || isReset">
                <ion-input type="text" label="Email" label-placement="floating" ref="state.emailInput" v-model="state.email" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin">
                <ion-input type="password" label="Password" label-placement="floating" ref="state.passwordInput" v-model="state.password" :required="isSignup || isLogin" v-on:keyup.enter="onEnter"></ion-input>
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

const { isApp } = useAppScreen();

const state = reactive({
  name: "",
  nameInput: null,
  email: "",
  emailInput: null,
  password: "",
  passwordInput: null,
  form: "login"
});

let isLogin = computed(() => state.form == "login");
let isSignup = computed(() => state.form == "signup");
let isReset = computed(() => state.form == "reset");

const { userLogin, userSignup, resetPassword } = useUsersStore();
  
function loginForm() {
  state.form = "login";
}

function signupForm() {
  state.form = "signup";
}

function resetForm() {
  state.form = "reset";
}

function hasName() {
  return hasInput(state.nameInput, state.name, "Please enter your name");
}

function hasEmail() {
  return hasInput(state.emailInput, state.email, "Please enter your email");
}

function hasPassword() {
  return hasInput(state.passwordInput, state.password, "Please enter your password");
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
        email: state.email, 
        password: state.password
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
      showError("Problem Logging In", error);
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
        name: state.name,
        email: state.email,
        password: state.password
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
      showError("Problem Signing Up", error);
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
        email: state.email
      });
      showAlert("Password Reset", "Please check your email for instructions to reset your password.");
    }
    catch (error) {
      showAlert("Problem Resetting Password", error);
    }
    finally {
      hideLoading();
    }
  }
}

function clearInputs() {
  state.name = "";
  state.email = "";
  state.password = "";
}
</script>

<style scoped>
</style>
