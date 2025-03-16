/* prettier-ignore */
import "floating-vue/dist/style.css";
/* prettier-ignore */
import "@/assets/styles/index.css";
import "@/assets/styles/rewrites/floating-vue.css"
/* prettier-ignore */
import { createApp } from "vue";

import router from "@/router"
import FloatingVue from "floating-vue"
import {createPinia} from "pinia"
import App from "./App.vue"
import vFocusOnMount from "./directives/vFocusOnMount"

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
  .directive("focus-on-mount", vFocusOnMount)
  .mount("#app")
