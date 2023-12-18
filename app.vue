<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
const { theme, dark } = useAppConfig();
settingsTheme(theme, dark);

const storage = useStorage();
onMounted(async () => {
  storage.set("ionic", "ionic");
  let test = await storage.get("ionic");
  console.log("onMounted ionic", test);
});
</script>