import {createRouter, createWebHistory} from "vue-router"
import {applyMiddlewares} from "./helpers/applyMiddlewares"
import {withRouteLoaded} from "./helpers/withRouteLoaded"
import authMiddleware from "./middlewares/auth"
import uiMiddleware from "./middlewares/ui"
import {routes} from "./routes"

import type {RouteRecordRaw} from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(to) {
    return to.hash ? {el: to.hash} : {top: window.scrollY}
  },
})

const {routeLoadedMiddleware} = withRouteLoaded(router, 30_000)

router.beforeEach(applyMiddlewares([routeLoadedMiddleware, uiMiddleware, authMiddleware]))

export default router
