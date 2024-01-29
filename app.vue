<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
const { theme, dark } = useAppConfig();
settingsTheme(theme, dark);

consoleLog("app", "script", "ionic");
onMounted(() => {
  consoleLog("app", "mounted", "ionic");
})
</script>