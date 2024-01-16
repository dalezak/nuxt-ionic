export default defineAppConfig({
  name: "Ionic",
  description: "Nuxt Ionic",
  theme: "default",
  dark: false,
  tabs: [
    {
      name: "home",
      label: "Home",
      path: "/home",
      icon: "home",
      auth: true
    },
    {
      name: "about",
      label: "About",
      path: "/about",
      icon: "informationCircle",
      auth: false
    },
    {
      name: "login",
      label: "Login",
      path: "/login",
      icon: "key",
      auth: false
    }
  ]
})