import {authReset} from "./authReset"
import {authStart} from "./authStart"
import {login} from "./login"
import {logout} from "./logout"
import {register} from "./register"
import {UserMethods} from "@/constants/messageTypes"

import type {Express} from "express"

export function initUserMethods(app: Express) {
  app.post(UserMethods["user.auth_start"], authStart)
  app.post(UserMethods["user.auth_reset"], authReset)
  app.post(UserMethods["user.login"], login)
  app.post(UserMethods["user.logout"], logout)
  app.post(UserMethods["user.register"], register)
}
