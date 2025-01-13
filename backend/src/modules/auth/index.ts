import * as controller from "./http/controller"
import * as routes from "./http/routes"
import {login} from "./methods/login"
import {register} from "./methods/register"
import {getStatus} from "./methods/status"
import {subscribeToUserStatus, unsubscribeFromUserStatus} from "./subscriptions/onUserStatus"

export const methods = {
  login,
  register,
  getStatus,
}

export const subscriptions = {
  subscribe: subscribeToUserStatus,
  unsubscribe: unsubscribeFromUserStatus,
}

export const httpAuth = {...controller, routes}
export * as wsAuth from "./ws/onMessage"
export type * as typesAuth from "./types"
