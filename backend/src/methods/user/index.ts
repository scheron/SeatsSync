import {authReset} from "./authReset"
import {authStart} from "./authStart"
import {login} from "./login"
import {logout} from "./logout"
import {register} from "./register"
import {saveRecoveryPhrase} from "./saveRecoveryPhrase"
import {UserMethods} from "@/constants/messageTypes"

import type {Router} from "express"

export function initUserMethods(router: Router) {
  router.post(UserMethods["user.auth_start"], authStart)
  router.post(UserMethods["user.auth_reset"], authReset)
  router.post(UserMethods["user.login"], login)
  router.post(UserMethods["user.logout"], logout)
  router.post(UserMethods["user.register"], register)
  router.post(UserMethods["user.save_recovery_phrase"], saveRecoveryPhrase)
}
