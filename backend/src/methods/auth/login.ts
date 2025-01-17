import {Errors} from "@/constants/errors"
import {COOKIE_OPTIONS} from "@/model/auth"
import {AuthService} from "@/services/auth"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await AuthService.getUser(username)
    if (!user) throw new ApiError(Errors.UserNotFound)

    const isValid = AuthService.isValidCode(user.secret, code)
    if (!isValid) throw new ApiError(Errors.InvalidCode)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie("token", newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username: user.username})
    logger.info("User logged in", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
    logger.error("Login failed", {error: (error as Error).message, username})
  }
}
