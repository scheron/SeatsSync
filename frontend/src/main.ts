/* prettier-ignore */
import "floating-vue/dist/style.css";
import "vue3-carousel/dist/carousel.css"
import "vue3-toastify/dist/index.css"
/* prettier-ignore */
import "@/assets/styles/global.css";
import "@/assets/styles/rewrites/floating-vue.css"
import "@/assets/styles/theme.css"
/* prettier-ignore */
import { createApp } from "vue";

import FloatingVue from "floating-vue"
import {createPinia} from "pinia"
import Vue3Toastify from "vue3-toastify"
import App from "./App.vue"

import type {ToastContainerOptions} from "vue3-toastify"

createApp(App)
  .use(createPinia())
  .use(FloatingVue, {
    themes: {
      tooltip: {
        placement: "top",
        distance: 5,
        skidding: 5,
        delay: {
          show: 500,
          hide: 200,
        },
        html: true,
        loadingContent: "...",
      },
    },
  })
  .use(Vue3Toastify, {
    autoClose: 1200,
    hideProgressBar: true,
    position: "top-center",
    pauseOnHover: true,
    limit: 12,
    closeButton: false,
    clearOnUrlChange: false,
  } as ToastContainerOptions)
  .mount("#app")
