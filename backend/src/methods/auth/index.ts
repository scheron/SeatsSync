import {login} from "./login"
import {register} from "./register"
import {start} from "./start"

import type {Express} from "express"

export function initAuthMethods(app: Express) {
  app.post("/auth/start", start)
  app.post("/auth/login", login)
  app.post("/auth/register", register)
}
