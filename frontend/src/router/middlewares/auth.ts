import {type NavigationGuardNext, type RouteLocationNormalized} from "vue-router"
import {useUserStore} from "@/stores/user"
import {ROUTE_NAMES} from "../routes"

export default async function authMiddleware(to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) {
  const userStore = useUserStore()

  if (to.meta.requiredStatus === "user") {
    const isLoggedIn = await userStore.checkUserStatus()
    if (!isLoggedIn) return next({name: ROUTE_NAMES.AUTH})

    return next()
  }

  if (to.meta.requiredStatus === "guest") {
    const isLoggedIn = await userStore.checkUserStatus()
    if (isLoggedIn) return next({name: ROUTE_NAMES.MAIN})

    return next()
  }

  if (!to.matched.length) return next({name: ROUTE_NAMES.MAIN})

  return next()
}
