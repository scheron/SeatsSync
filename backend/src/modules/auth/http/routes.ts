import {login, register, saveRecoveryPhrase, start} from "./controller"
import {rateLimitAuth, requireAuth, validateAuthBody} from "./middleware"

import type {Express} from "express"

export function initAuthRoutes(app: Express) {
  app.post("/auth/start", rateLimitAuth, validateAuthBody, start)
  app.post("/auth/login", rateLimitAuth, validateAuthBody, login)
  app.post("/auth/register", rateLimitAuth, validateAuthBody, register)
  app.post("/auth/save_recovery_phrase", rateLimitAuth, requireAuth, saveRecoveryPhrase)
}
