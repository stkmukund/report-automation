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

  modules: ["@nuxt/ui"],
  runtimeConfig: {
    CC_LOGIN_ID: "revboostapirs.nymbus",
    CC_PASSWORRD: "RSsfFrR2nN5PcC6L1pSRs",
    // Keys within public are also exposed client-side
    public: {
      salesTotal: "sales-total",
      CC_LOGIN_ID: "revboostapirs.nymbus",
      CC_PASSWORRD: "RSsfFrR2nN5PcC6L1pSRs",
    },
  },
});
