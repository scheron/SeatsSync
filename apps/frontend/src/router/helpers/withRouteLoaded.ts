import {useUIStore} from "@/stores/ui"

import type {NavigationGuardNext, RouteLocationNormalized, Router} from "vue-router"

declare module "vue-router" {
  interface Router {
    routeLoaded: () => void
  }
}

export function withRouteLoaded(router: Router, hideTimeout = 10_000) {
  let timer: ReturnType<typeof setTimeout> | null = null

  function resetTimeout() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function autocloseTimeout(to: RouteLocationNormalized) {
    const timeoutDuration = to.meta.loadingHideTimeout ?? hideTimeout

    timer = setTimeout(() => {
      useUIStore().setLoadingPage(false)
    }, timeoutDuration)
  }

  async function routeLoadedMiddleware(to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) {
    const showDelay = to.meta.loadingShowDelay

    useUIStore().setLoadingPage(true, showDelay)

    const isManualLoadingStop = to.meta.manualLoadingStop ?? false

    if (!isManualLoadingStop) {
      useUIStore().setLoadingPage(false)
      next()
    } else {
      autocloseTimeout(to)
      next()
    }
  }

  router.routeLoaded = () => {
    resetTimeout()
    useUIStore().setLoadingPage(false)
  }

  return {
    routeLoadedMiddleware,
  }
}
