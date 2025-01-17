import {Errors} from "@/constants/errors"
import {COOKIE_OPTIONS} from "@/model/auth"
import {AuthService} from "@/services/auth"
import {createJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const existingUser = await AuthService.getUser(username)
    if (existingUser) return sendError(res, Errors.UserAlreadyExists, 400)

    const candidate = AuthService.validateCandidate(username, code)
    const user = await AuthService.createUser(candidate.username, candidate.secret)

    AuthService.deleteCandidate(username)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie("token", newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username})
    logger.info("User registered", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
    logger.error("Registration failed", {error: (error as Error).message, username})
  }
}
