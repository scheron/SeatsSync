import {authReset} from "./authReset"
import {authStart} from "./authStart"
import {login} from "./login"
import {logout} from "./logout"
import {register} from "./register"
import {saveRecoveryPhrase} from "./saveRecoveryPhrase"
import {Methods} from "@/constants/messageTypes"

import type {Router} from "express"

export function initUserMethods(router: Router) {
  router.post(Methods["user.auth_start"], authStart)
  router.post(Methods["user.auth_reset"], authReset)
  router.post(Methods["user.login"], login)
  router.post(Methods["user.logout"], logout)
  router.post(Methods["user.register"], register)
  router.post(Methods["user.save_recovery_phrase"], saveRecoveryPhrase)
}
