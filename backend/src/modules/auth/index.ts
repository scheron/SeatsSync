import * as controller from "./http/controller"
import * as routes from "./http/routes"

export * as wsAuth from "./ws/onMessage"
export const httpAuth = {...controller, routes}
export type * as typesAuth from "./types"
