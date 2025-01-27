import {COOKIE_OPTIONS, TOKEN_NAME} from "model/user"
import {notifyUserUpdate} from "@/subscriptions/user"
import {UserService} from "@/services/user"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await UserService.getUser(username)
    if (!user) throw new ApiError(Errors.UserNotFound)

    const isValid = UserService.isValidCode(user.secret, code)
    if (!isValid) throw new ApiError(Errors.InvalidCode)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie(TOKEN_NAME, newToken, COOKIE_OPTIONS)
    logger.info("Setting cookie", {
      name: TOKEN_NAME,
      value: newToken,
      options: COOKIE_OPTIONS,
    })

    sendSuccess(res, {username: user.username})
    notifyUserUpdate({status: "user", username: user.username})
    logger.info("User logged in", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Login failed", {error: (error as Error).message, username})
  }
}
