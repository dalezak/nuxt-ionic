<!--
  /your-data — take everything with you, or remove everything.

  The client half of nuxt-supabase's `_shared/account-data.ts`. Calls the app's
  `export-user-data` and `delete-user-account` edge functions, which every app
  owns as one-line wrappers around that handler. Required before store review
  (Apple Guideline 5.1.1(v): account deletion reachable in the app).

  Copy comes from `appConfig.yourData` ({ lede, exportDescription,
  deleteDescription, deleteConfirm }); each line falls back to a neutral
  default naming `appConfig.name`. An app can still shadow the whole page with
  its own `pages/tabs/your-data.vue`.
-->
<template>
  <ion-page>
    <app-header title="Your Data" back-href="/profile" />
    <ion-content :fullscreen="true" class="ion-padding">
      <page-content>

      <section-lede>{{ copy.lede }}</section-lede>

      <!-- Export — download a JSON of every user-owned row. -->
      <section-card
        :icon="downloadOutline"
        subtitle="Export"
        title="Download Your Data"
        :primary-cta="{
          label: state.exporting ? 'Preparing…' : 'Download as JSON',
          icon: downloadOutline,
          loading: state.exporting,
        }"
        @primary="onExport">
        <p>{{ copy.exportDescription }}</p>
      </section-card>

      <!-- Delete — irreversible, requires email confirmation. -->
      <section-card
        accent="alert"
        :icon="trashOutline"
        subtitle="Delete"
        title="Delete Your Account"
        :primary-cta="{
          label: state.deleting ? 'Deleting…' : 'Delete account permanently',
          icon: trashOutline,
          color: 'danger',
          loading: state.deleting,
          disabled: !canDelete,
        }"
        @primary="onDelete">
        <p>
          {{ copy.deleteDescription }}
          <strong>This cannot be undone.</strong> If you've paired or connected
          with anyone, your side is removed; their data stays intact.
        </p>

        <p class="ion-margin-top">
          To confirm, type your account email below:
          <strong>{{ profile?.email }}</strong>
        </p>

        <ion-input
          v-model="state.confirmation"
          class="your-data-confirm-input"
          type="email"
          inputmode="email"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          placeholder="Confirm by typing your email"
          :disabled="state.deleting" />
      </section-card>
      </page-content>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { checkmarkCircle, downloadOutline, trashOutline } from 'ionicons/icons';
definePageMeta({ middleware: 'auth' });

const appConfig = useAppConfig();
const { loadProfile, profile } = useProfile();

// Profile is needed for both the canDelete email comparison and the
// export-filename suffix. Populate on mount so canDelete computes
// correctly the moment the user starts typing their confirmation.
onMounted(loadProfile);

const appName = computed(() => appConfig.name || 'this app');

// "LoveWell" → "love-well" — the same slug the server puts in its
// Content-Disposition filename.
const appSlug = computed(() => appName.value
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/[^A-Za-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase() || 'account');

const copy = computed(() => {
  const custom = appConfig.yourData ?? {};
  const name = appName.value;
  return {
    lede: custom.lede
      ?? `Everything ${name} knows about you, with the option to take it with you or remove it entirely. Nothing the app stores about you is hidden from you.`,
    exportDescription: custom.exportDescription
      ?? "A JSON bundle of everything you've written, saved and set up, plus your progress and settings. Excludes platform content (courses, lessons, quotes) because that's the same for every user, not yours specifically.",
    deleteDescription: custom.deleteDescription
      ?? "Permanently removes everything you've written, saved and set up, along with your progress and settings.",
    deleteConfirm: custom.deleteConfirm
      ?? `This permanently removes everything ${name} stores about you. It cannot be undone — even by support.`,
  };
});

const state = reactive({
  exporting: false,
  deleting: false,
  confirmation: '',
});

// Delete button only enables when the typed email matches the user's
// account email (case-insensitive). Same comparison the server enforces.
const canDelete = computed(() => {
  const typed = state.confirmation?.trim().toLowerCase();
  const account = profile.value?.email?.toLowerCase();
  return !!typed && !!account && typed === account;
});

async function onExport() {
  state.exporting = true;
  // Reads every table the user owns, then serialises the lot. Seconds, with a
  // file download at the end, and a button spinner alone is easy to miss.
  showLoading('Gathering your data…');
  try {
    const bundle = await invokeFunction('export-user-data');
    if (!bundle) {
      showAlertError('Export failed', new Error('Empty response from server'));
      return;
    }
    // Serialising and blobbing a full account is its own wait, and it happens
    // after the network is done — so the message stops claiming to be reading.
    showLoading('Preparing your download…');
    triggerDownload(bundle);
    showToast('Export ready', checkmarkCircle);
  } catch (error) {
    consoleError('your-data onExport', error);
    showAlertError("Couldn't export your data", error);
  } finally {
    state.exporting = false;
    hideLoading(0);
  }
}

// Client-side download trigger. The server returns the bundle as JSON;
// we wrap it in a Blob and use a synthetic anchor click to save it. Works
// in browsers; on iOS/Android via Capacitor this opens the share sheet,
// which is acceptable v1 UX (user picks Files / iCloud / etc.).
function triggerDownload(bundle) {
  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `${appSlug.value}-export-${(profile.value?.id ?? 'anon').slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function onDelete() {
  if (!canDelete.value) return;
  await showConfirm(
    'Delete your account?',
    null,
    copy.value.deleteConfirm,
    async () => {
      state.deleting = true;
      // Irreversible, and it cascades through every table before signing the
      // user out. Nothing on this page should be tappable while it runs.
      showLoading('Deleting your account…');
      try {
        await invokeFunction('delete-user-account', {
          confirmation: state.confirmation.trim(),
        });
        // Account is gone — local session is now orphaned. Route through
        // the /logout flow, which clears the Supabase session and boots back
        // to the start page. Overlay goes before the sign-out, so it leaves
        // with the session rather than hanging over the login screen. No
        // `finally` on purpose: `state.deleting` stays set on success because
        // there is no account left to act on.
        hideLoading(0);
        showUserLogout();
      } catch (error) {
        consoleError('your-data onDelete', error);
        showAlertError("Couldn't delete your account", error);
        state.deleting = false;
        hideLoading(0);
      }
    },
    'Delete permanently',
    'Cancel',
  );
}
</script>

<style scoped>
/* Card chrome + danger-accent border come from section-card (accent="alert"). */

.your-data-confirm-input {
  margin-top: var(--space-3);
  border: 1px solid var(--ion-color-medium-tint);
  border-radius: var(--radius-md);
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
}
</style>
