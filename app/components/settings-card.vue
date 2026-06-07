<!--
  SettingsCard — a self-contained, config-driven settings UI.

  Each app declares its settings in app.config `settings` (sections →
  items); this renders one <section-card> per section, a row per item, and
  dispatches the right control by the item's `type` (toggle today; select /
  others are a couple lines when needed). It LOADS and PERSISTS on its own —
  `useSettings()` reads the account-scoped `users.settings` blob (which
  rides along with the profile) and writes one key at a time via the atomic
  merge RPC. Drop it anywhere; it loads the profile itself.

  Plan-gating: an item with a `plan` slug is locked for free users — the
  control disables and tapping the row emits `upsell` with the slug so the
  host app runs its own paywall. `isPaid` is passed in so this stays agnostic
  about how each app computes entitlement.

    <settings-card :is-paid="isPaid" @upsell="onUpsell" />

  Item shape: { id, type, label, description?, icon?, default, plan?, options? }
-->

<template>
  <section-card
    v-for="section in sections"
    :key="section.title"
    :icon="section.icon ? getIcon(section.icon) : null"
    :title="section.title">
    <ion-list lines="full" class="ion-no-padding">
      <ion-item
        v-for="item in section.items"
        :key="item.id"
        :button="isLocked(item)"
        :detail="false"
        @click="isLocked(item) && emit('upsell', item.plan)">
        <ion-icon v-if="item.icon" slot="start" :icon="getIcon(item.icon)" color="medium"></ion-icon>
        <ion-label class="ion-text-wrap">
          <h3>{{ item.label }}</h3>
          <p v-if="item.description">{{ item.description }}</p>
          <ion-note v-if="isLocked(item)" color="warning">Available on a paid plan</ion-note>
        </ion-label>

        <!-- boolean -->
        <ion-toggle
          v-if="item.type === 'toggle'"
          slot="end"
          :checked="get(item.id, item.default)"
          :disabled="isLocked(item)"
          @ion-change="onChange(item, $event.detail.checked)">
        </ion-toggle>

        <!-- choice -->
        <ion-select
          v-else-if="item.type === 'select'"
          slot="end"
          interface="popover"
          :value="get(item.id, item.default)"
          :disabled="isLocked(item)"
          @ion-change="onChange(item, $event.detail.value)">
          <ion-select-option v-for="opt in item.options || []" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </ion-select-option>
        </ion-select>
      </ion-item>
    </ion-list>
  </section-card>
</template>

<script setup>
const props = defineProps({
  // Setting sections; defaults to the host app's app.config `settings`.
  sections: { type: Array, default: () => useAppConfig().settings ?? [] },
  // Whether the current user is on a paid plan — gates `plan` items. Defaults
  // true so an app that passes nothing gets no gating.
  isPaid: { type: Boolean, default: true },
});

const emit = defineEmits(['upsell', 'change']);

const { loadProfile } = useProfile();
const { get, set } = useSettings();

// Self-contained: ensure the profile (and its settings blob) is loaded so
// controls reflect real values even on a surface that hasn't loaded it.
// loadProfile() is idempotent — a no-op when the profile is already loaded.
onMounted(loadProfile);

function isLocked(item) {
  return !!item.plan && !props.isPaid;
}

// Persist a changed value. Skips the no-op ion-change that fires on mount
// with the bound value; atomic single-key write via useSettings.
async function onChange(item, value) {
  if (isLocked(item)) return;
  if (value === get(item.id, item.default)) return;
  const ok = await set(item.id, value);
  if (ok) emit('change', item.id, value);
}
</script>
