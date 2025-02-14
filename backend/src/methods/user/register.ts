import {notifyUpdate} from "@/subscriptions/user"
import {UserService} from "@/services/user"
import {COOKIE_OPTIONS, TOKEN_NAME} from "@/model/user"
import {Errors} from "@/constants/errors"
import {createJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const existingUser = await UserService.getUser(username)
    if (existingUser) return sendError(res, Errors.UserAlreadyExists, 400)

    const candidate = UserService.validateCandidate(username, code)
    const user = await UserService.createUser(candidate.username, candidate.secret)

    UserService.deleteCandidate(username)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie(TOKEN_NAME, newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username})
    notifyUpdate({status: "user", username: user.username})
    logger.info("User registered", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Registration failed", {error: (error as Error).message, username})
  }
}
