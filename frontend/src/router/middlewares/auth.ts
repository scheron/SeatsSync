import {type NavigationGuardNext, type RouteLocationNormalized} from "vue-router"
import {useUserStore} from "@/stores/user"
import {ROUTE_NAMES} from "../routes"

export default async function authMiddleware(to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) {
  const userStore = useUserStore()
  const status = await userStore.getUserStatus()

  if (to.meta.requiredStatus === "user" && status !== "user") return next({name: ROUTE_NAMES.AUTH})
  if (to.meta.requiredStatus === "guest" && status === "user") return next({name: ROUTE_NAMES.MAIN})
  if (!to.matched.length) return next({name: ROUTE_NAMES.MAIN})

  return next()
}
