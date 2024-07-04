// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["/public/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // generate: {
  //   dir: "out",
  // },
  routeRules: {
    "/api/**": {
      cors: true,
    },
  },

  modules: ["@nuxt/ui"]
});