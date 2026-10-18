export default defineAppConfig({
  name: "Ionic",
  description: "Nuxt Ionic",
  theme: "default",
  dark: false,
  // Copy for the `/your-data` page (export + delete account). Each is optional:
  // null falls back to a neutral default naming `name` above. Apps override the
  // lines where their data needs naming — e.g. an app that stores notes about
  // someone's kids should say so in the delete description.
  yourData: {
    lede: null,
    exportDescription: null,
    deleteDescription: null,
    deleteConfirm: null,
  },
  tabs: [
    // {
    //   name: "login",
    //   label: "Login",
    //   path: "/login",
    //   icon: "key",
    //   public: true
    // }
  ]
})