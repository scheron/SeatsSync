import {useUIStore} from "@/stores/ui"

import type {NavigationGuardNext, RouteLocationNormalized} from "vue-router"

export default async function uiMiddleware(to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) {
  const uiStore = useUIStore()

  uiStore.setHeaderVisibility(!to.meta.hideHeader)

  return next()
}
