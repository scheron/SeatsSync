import {login, register, saveRecoveryPhrase, start} from "./controller"
import {requireAuth, validateAuthBody} from "./middleware"

import type {Express} from "express"

export function initAuthRoutes(app: Express) {
  app.post("/auth/start", validateAuthBody, start)
  app.post("/auth/login", validateAuthBody, login)
  app.post("/auth/register", validateAuthBody, register)
  app.post("/auth/save_recovery_phrase", requireAuth, saveRecoveryPhrase)
}
