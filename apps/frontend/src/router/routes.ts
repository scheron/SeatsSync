import type {RouteRecordRaw} from "vue-router"

export const ROUTE_NAMES = {
  MAIN: "MAIN",
  AUTH: "AUTH",
  RESERVE: "RESERVE",
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: ROUTE_NAMES.MAIN,
    meta: {
      requiredStatus: "user",
      title: "Seats Sync",
      loadingShowDelay: 0,
      manualLoadingStop: true,
    },
    component: () => import("@/ui/pages/MainPage"),
  },
  {
    path: "/reserve",
    name: ROUTE_NAMES.RESERVE,
    meta: {
      requiredStatus: "user",
      title: "Reserve",
      loadingShowDelay: 0,
    },
    component: () => import("@/ui/pages/ReservePage"),
  },
  {
    path: "/auth",
    name: ROUTE_NAMES.AUTH,
    meta: {
      hideHeader: true,
      requiredStatus: "guest",
      title: "Welcome",
      loadingShowDelay: 0,
      loadingHideTimeout: 0,
    },
    component: () => import("@/ui/pages/AuthPage"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: () => ({name: ROUTE_NAMES.MAIN}),
  },
]
