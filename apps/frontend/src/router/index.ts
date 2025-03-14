import {createRouter, createWebHistory} from "vue-router"
import {applyMiddlewares} from "./helpers/applyMiddlewares"
import authMiddleware from "./middlewares/auth"
import {routes} from "./routes"

import type {RouteRecordRaw} from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(to) {
    return to.hash ? {el: to.hash} : {top: window.scrollY}
  },
})

router.beforeEach(applyMiddlewares([authMiddleware]))

export default router
