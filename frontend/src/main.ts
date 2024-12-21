/* prettier-ignore */
import { createApp } from "vue";
import "floating-vue/dist/style.css"
/* prettier-ignore */
import "@/assets/styles/global.css";
import "@/assets/styles/theme.css"
import "@/assets/styles/rewrites/floating-vue.css"

import FloatingVue from "floating-vue"
import {createPinia} from "pinia"
import App from "./App.vue"

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
  .mount("#app")
