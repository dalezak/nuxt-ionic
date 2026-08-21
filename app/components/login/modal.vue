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
        <ion-button size="small" @click="onCancel">Cancel</ion-button>
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
      <ion-button size="small" expand="block" color="primary" @click="doSignup" v-if="isSignup">Signup</ion-button>
      <ion-button size="small" expand="block" color="primary" @click="doLogin" v-else-if="isLogin">Login</ion-button>
      <ion-button size="small" expand="block" color="primary" @click="doReset" v-else-if="isReset">Reset Password</ion-button>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup>
const props = defineProps({
  // Where to land on success. Deep-link bounces pass the original path;
  // otherwise null → the app root. Only relative paths are honored.
  returnPath: { type: String, default: null },
});

// Remembered email from the last successful login/signup (1-year cookie).
// Present → a returning user: default to LOGIN with the email prefilled.
// Absent → almost certainly a first-time visitor: default to SIGNUP (the old
// login-first default made every new user find the "Don't have an account?"
// link). The manual mode links below still switch freely either way.
const lastEmail = useCookie("last_login_email", { maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });

const state = reactive({
  name: "",
  nameInput: null,
  email: lastEmail.value ?? "",
  emailInput: null,
  password: "",
  passwordInput: null,
  form: lastEmail.value ? "login" : "signup"
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
// (deep-link bounce) or the app root, then HOLD until the destination has
// visually COVERED the public page we're leaving.
//
// Why the hold: showPage/showPageIndex fire `$ionRouter.navigate` and return
// immediately. The caller dismisses the "Logging in…" spinner in its `finally`
// right after this returns — if we don't wait, the spinner clears while the
// public Start page is still on screen, and it flashes for ~1s until the
// destination swaps in.
//
// Why not wait on the Vue route: `router.currentRoute` flips to `/today` the
// instant navigation COMMITS — which is the START of Ionic's root-replace
// transition, not the end. The outgoing Start page keeps painting for the whole
// ~300ms animation after that. Waiting on the route change therefore released
// the spinner mid-transition and the Start page flashed (the bug this replaces).
//
// Instead we grab the `ion-page` that's currently on top (the Start page, once
// the modal is dismissed) and wait until Ionic hides it (`ion-page-hidden`) or
// tears it out of the DOM — i.e. the destination now fully covers it. Only then
// is it safe to drop the spinner. Safety timeout so a navigation hiccup can't
// strand it.
async function finishAuth() {
  clearInputs();
  await hideModal();
  // Capture AFTER the modal dismisses, so the topmost page is the one we're
  // leaving (the public Start page), not the modal's own inner ion-page.
  const outgoing = topVisiblePage();
  const path = typeof props.returnPath === 'string' && props.returnPath.startsWith('/') ? props.returnPath : null;
  if (path) showPage(path, true, true);
  else showPageIndex();
  await waitForPageCovered(outgoing);
}

// The topmost visible Ionic page in the router outlet, or null (SSR / none).
function topVisiblePage() {
  if (typeof document === 'undefined') return null;
  const pages = document.querySelectorAll('.ion-page:not(.ion-page-hidden)');
  return pages.length ? pages[pages.length - 1] : null;
}

// Resolve once `outgoing` is covered by the incoming page — Ionic marks a page
// that's no longer on top with `.ion-page-hidden`, and a root-replace removes it
// from the DOM entirely — or after `timeoutMs` as a backstop.
function waitForPageCovered(outgoing, timeoutMs = 5000) {
  if (typeof document === 'undefined' || !outgoing) return Promise.resolve();
  const covered = () => !outgoing.isConnected || outgoing.classList.contains('ion-page-hidden');
  if (covered()) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(timer); resolve(); };
    const tick = () => { if (done) return; if (covered()) finish(); else requestAnimationFrame(tick); };
    const timer = setTimeout(finish, timeoutMs);
    requestAnimationFrame(tick);
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
        lastEmail.value = state.email;  // remember for next launch's prefill
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
        // user to confirm, then log in. Remember the email NOW so their return
        // trip lands on Login, prefilled — exactly the path we just told them
        // to take.
        lastEmail.value = state.email;
        showAlert("Check your email", `We sent a confirmation link to ${state.email}. Tap it to finish setting up your account, then log in.`);
      }
      else if (user) {
        lastEmail.value = state.email;  // remember for next launch's prefill
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

