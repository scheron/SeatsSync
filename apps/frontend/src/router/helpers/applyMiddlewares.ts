import type {NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw} from "vue-router"

type Middleware = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => Promise<void> | void

export function applyMiddlewares(middlewares: Middleware[]): Middleware {
  return async (to, from, next) => {
    try {
      for (const middleware of middlewares) {
        const result = await new Promise<void | RouteLocationRaw | false>((resolve, reject) => {
          try {
            middleware(to, from, (nextArg?: any) => (nextArg !== undefined ? resolve(nextArg) : resolve()))
          } catch (error) {
            console.log("Error in middleware", error)
            reject(error)
          }
        })

        if (result !== undefined) return next(result as any)
      }

      next()
    } catch (error) {
      console.error("Middleware chain error:", error)
      next(false)
    }
  }
}
