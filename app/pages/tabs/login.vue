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
      <page-content>

        <section-card
          :title="formTitle"
          :subtitle="formSubtitle">
          <ion-list lines="none" class="login-fields">
            <ion-input v-if="isSignup" type="text" autocapitalize="words" autocorrect="off" spellcheck="false" label="Name" label-placement="floating" mode="md" fill="outline" ref="state.nameInput" v-model="state.name" :required="isSignup" v-on:keyup.enter="onEnter" class="login-input"></ion-input>
            <ion-input v-if="isSignup || isLogin || isReset" type="email" inputmode="email" autocapitalize="off" autocorrect="off" spellcheck="false" label="Email" label-placement="floating" mode="md" fill="outline" ref="state.emailInput" v-model="state.email" required v-on:keyup.enter="onEnter" class="login-input"></ion-input>
            <ion-input v-if="isSignup || isLogin" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" label="Password" label-placement="floating" mode="md" fill="outline" ref="state.passwordInput" v-model="state.password" :required="isSignup || isLogin" v-on:keyup.enter="onEnter" class="login-input"></ion-input>
          </ion-list>
          <template #footer>
            <div class="ion-text-end">
              <ion-button fill="solid" @click="doSignup" v-if="isSignup">Signup</ion-button>
              <ion-button fill="solid" @click="doLogin" v-else-if="isLogin">Login</ion-button>
              <ion-button fill="solid" @click="doReset" v-else-if="isReset">Email Instructions</ion-button>
            </div>
          </template>
        </section-card>

        <section-card>
          <ion-button fill="clear" @click="loginForm" v-if="isSignup || isReset">Already have an account?</ion-button>
          <ion-button fill="clear" @click="signupForm" v-if="isLogin || isReset">Don't have an account?</ion-button>
          <ion-button fill="clear" @click="resetForm" v-if="isLogin">Forgot your password?</ion-button>
        </section-card>

      </page-content>
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

// Header text per form mode — lifted to computeds so the template
// stays declarative and the section-card primitive can stay generic.
const formTitle = computed(() => {
  if (isSignup.value) return "Welcome";
  if (isLogin.value) return "Welcome back";
  if (isReset.value) return "Forgot password";
  return null;
});

const formSubtitle = computed(() => {
  if (isSignup.value) return "Enter your name, email, and password";
  if (isLogin.value) return "Enter your email and password";
  if (isReset.value) return "Enter your email";
  return null;
});

const usersStore = useUsersStore();
const route = useRoute();

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
  if (isSignup.value && hasName() && hasEmail() && hasPassword()) {
    doSignup();
  }
  else if (isLogin.value && hasEmail() && hasPassword()) {
    doLogin();
  }
  else if (isReset.value && hasEmail()) {
    doReset();
  }
}

// `?return=<path>` lets deep-link surfaces (e.g. `/join/<code>`) bounce
// users through login and land them back on the original destination
// instead of the tab index. Only relative paths are honored — guards
// against `?return=https://evil.example` open-redirects.
function returnPath() {
  const raw = route.query.return;
  return typeof raw === 'string' && raw.startsWith('/') ? raw : null;
}

function finishAuth() {
  const path = returnPath();
  if (path) showPage(path, true, true);
  else showPageIndex();
}

async function doLogin() {
  if (hasEmail() && hasPassword()) {
    try {
      await showLoading("Logging in...");
      let user = await usersStore.userLogin({
        email: state.email,
        password: state.password
      });
      if (user) {
        showToast("Welcome back friend");
        clearInputs();
        finishAuth();
      }
      else {
        showAlert("Problem Logging In", "Please enter your credentials and try again.");
      }
    }
    catch (error) {
      showAlertError("Problem Logging In", error);
    }
    finally {
      hideLoading();
    }
  }
}

async function doSignup() {
  if (hasName() && hasEmail() && hasPassword()) {
    try {
      await showLoading("Signing up...");
      let user = await usersStore.userSignup({
        name: state.name,
        email: state.email,
        password: state.password
      });
      if (user) {
        showToast("Welcome friend");
        clearInputs();
        finishAuth();
      }
      else {
        showAlert("Problem Signing Up", "Please enter your information and try again.");
      }
    }
    catch (error) {
      const message = error?.message ?? '';
      if (/already registered|already exists/i.test(message)) {
        showAlert("Account Exists", `An account with ${state.email} already exists. Try logging in instead.`);
      }
      else if (/password/i.test(message)) {
        showAlertError("Password Problem", null, message);
      }
      else {
        showAlertError("Problem Signing Up", null, message || "Please try again.");
      }
    }
    finally {
      hideLoading();
    }
  }
}

async function doReset() {
  if (hasEmail()) {
    try {
      await showLoading("Sending reset email...");
      await usersStore.resetPassword({
        email: state.email
      });
      showAlert("Password Reset", "Please check your email for instructions to reset your password.");
    }
    catch (error) {
      showAlertError("Problem Resetting Password", error);
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
.login-fields {
  background: transparent;
  /* Top padding clears the first floating label — MD's `label-placement="floating"`
     positions the active label ~8px above the input outline, and section-card's
     `overflow: hidden` (for stripe clipping) would otherwise crop it. */
  padding: 0.5rem 0 0;
}

/* Space between inputs since they're no longer wrapped in ion-item
   rows that provided implicit row spacing. Last input gets an extra
   bottom margin — fine since the footer button has its own spacing. */
.login-input {
  margin-bottom: 0.75rem;
}
</style>
