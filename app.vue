<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
const { theme, dark } = useAppConfig();
settingsTheme(theme, dark);

onMounted(async () => {
  consoleLog("onMounted ionic", process.client ? "client" : "server");
})
</script>