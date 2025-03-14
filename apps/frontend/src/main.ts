/* prettier-ignore */
import "floating-vue/dist/style.css";
import "vue3-carousel/dist/carousel.css"
/* prettier-ignore */
import "@/assets/styles/index.css";
import "@/assets/styles/rewrites/floating-vue.css"
/* prettier-ignore */
import { createApp } from "vue";

import router from "@/router"
import FloatingVue from "floating-vue"
import {createPinia} from "pinia"
import App from "./App.vue"

createApp(App)
  .use(createPinia())
  .use(router)
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
  .mount("#app")
