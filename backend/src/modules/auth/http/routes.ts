import {login, register, saveRecoveryPhrase, start} from "./controller"

import type {Express} from "express"

export function initAuthRoutes(app: Express) {
  app.post("/auth/start", start)
  app.post("/auth/login", login)
  app.post("/auth/register", register)
  app.post("/auth/save_recovery_phrase", saveRecoveryPhrase)
}
