import type {RouteRecordRaw} from "vue-router"

export const ROUTE_NAMES = {
  MAIN: "MAIN",
  AUTH: "AUTH",
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: ROUTE_NAMES.MAIN,
    meta: {requiredStatus: "user", title: "Seats Sync"},
    component: () => import("@/ui/pages/MainPage"),
  },
  {
    path: "/auth",
    name: ROUTE_NAMES.AUTH,
    meta: {hideHeader: true, requiredStatus: "guest", title: "Welcome"},
    component: () => import("@/ui/pages/AuthPage"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: () => ({name: ROUTE_NAMES.MAIN}),
  },
]
