import {createApp} from "vue"

import "@/assets/styles/global.css"
import "@/assets/styles/theme.css"

import {createPinia} from "pinia"
import App from "./App.vue"

createApp(App).use(createPinia()).mount("#app")
