<!--
  login-modal — authentication in a modal (replaces the old /login route).
  Same functionality as the page it came from: toggle between Login / Signup /
  Reset, same usersStore calls. On success it dismisses itself and lands the
  user on the return path (deep-link bounce) or the app root.

  Opened via `showUserLogin(returnPath)`. The auth middleware bounces
  unauthenticated users to a public page with `?login`, and a client plugin
  detects that and calls `showUserLogin` — so this is the single auth surface.
-->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Get Started</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="onCancel">Cancel</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">

    <h2 class="login-title">{{ formTitle }}</h2>
    <p class="login-subtitle">{{ formSubtitle }}</p>

    <ion-list lines="none" class="login-fields">
      <ion-input v-if="isSignup" type="text" autocapitalize="words" autocorrect="off" spellcheck="false" label="Name" label-placement="floating" mode="md" fill="outline" ref="state.nameInput" v-model="state.name" :required="isSignup" v-on:keyup.enter="onEnter" class="login-input"></ion-input>
      <ion-input v-if="isSignup || isLogin || isReset" type="email" inputmode="email" autocapitalize="off" autocorrect="off" spellcheck="false" label="Email" label-placement="floating" mode="md" fill="outline" ref="state.emailInput" v-model="state.email" required v-on:keyup.enter="onEnter" class="login-input"></ion-input>
      <ion-input v-if="isSignup || isLogin" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" label="Password" label-placement="floating" mode="md" fill="outline" ref="state.passwordInput" v-model="state.password" :required="isSignup || isLogin" v-on:keyup.enter="onEnter" class="login-input"></ion-input>
    </ion-list>

    <div class="login-links">
      <ion-button fill="clear" size="small" @click="signupForm" v-if="isLogin">Don't have an account?</ion-button>
      <ion-button fill="clear" size="small" @click="resetForm" v-if="isLogin">Forgot your password?</ion-button>
      <ion-button fill="clear" size="small" @click="loginForm" v-if="isSignup || isReset">Already have an account?</ion-button>
    </div>

  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button expand="block" color="primary" @click="doSignup" v-if="isSignup">Signup</ion-button>
      <ion-button expand="block" color="primary" @click="doLogin" v-else-if="isLogin">Login</ion-button>
      <ion-button expand="block" color="primary" @click="doReset" v-else-if="isReset">Reset Password</ion-button>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
const props = defineProps({
  // Where to land on success. Deep-link bounces pass the original path;
  // otherwise null → the app root. Only relative paths are honored.
  returnPath: { type: String, default: null },
});

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

// Header text per form mode — kept as computeds so the template stays declarative.
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

// Cancel — dismiss without authenticating; the user stays on whatever public
// page opened the modal.
async function onCancel() {
  await hideModal();
}

// Success — dismiss the modal, kick off navigation to the return path
// (deep-link bounce) or the app root, then HOLD until the route actually
// leaves the public page we're on.
//
// Why the hold: showPage/showPageIndex fire `$ionRouter.navigate` and return
// immediately, but the destination (e.g. Today) only becomes the active route
// after its auth middleware + initial load resolve (~1s). The caller dismisses
// the "Logging in…" spinner in its `finally` right after this returns — if we
// don't wait, the spinner clears while navigation is still in flight, the
// just-dismissed modal reveals the public Start page, and it flashes for ~1s
// until the destination swaps in. Awaiting the route change keeps the spinner
// up across the whole transition. Safety timeout so a navigation hiccup can't
// strand the spinner.
async function finishAuth() {
  clearInputs();
  const router = useRouter();
  const fromPath = router.currentRoute.value.path;
  await hideModal();
  const path = typeof props.returnPath === 'string' && props.returnPath.startsWith('/') ? props.returnPath : null;
  if (path) showPage(path, true, true);
  else showPageIndex();
  await waitForRouteLeave(router, fromPath);
}

// Resolve once the active route path differs from `fromPath` (i.e. the
// destination has taken over), or after `timeoutMs` as a backstop.
function waitForRouteLeave(router, fromPath, timeoutMs = 5000) {
  if (router.currentRoute.value.path !== fromPath) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      stop();
      clearTimeout(timer);
      resolve();
    };
    const stop = watch(() => router.currentRoute.value.path, (p) => {
      if (p !== fromPath) finish();
    });
    const timer = setTimeout(finish, timeoutMs);
  });
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
        await finishAuth();
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
      if (user?.confirmationPending) {
        // Account created but email confirmation is required — no session yet.
        // Don't navigate into the app (every RLS read would fail); tell the
        // user to confirm, then log in.
        showAlert("Check your email", `We sent a confirmation link to ${state.email}. Tap it to finish setting up your account, then log in.`);
      }
      else if (user) {
        showToast("Welcome friend");
        await finishAuth();
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
.login-title {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0.25rem 0 0.35rem;
}

.login-subtitle {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ion-color-medium-shade);
  margin: 0 0 1.25rem;
}

.login-fields {
  background: transparent;
  /* Top padding clears the first floating label — MD's `label-placement="floating"`
     positions the active label ~8px above the input outline. */
  padding: 0.5rem 0 0;
}

/* Space between inputs since they're no longer wrapped in ion-item
   rows that provided implicit row spacing. */
.login-input {
  margin-bottom: 0.75rem;
}

.login-links {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0.25rem;
}

/* Inset the footer submit button so it isn't edge-to-edge. */
ion-footer ion-toolbar {
  --padding-start: 1rem;
  --padding-end: 1rem;
}
</style>
