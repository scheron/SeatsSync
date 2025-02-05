import cookie from "cookie"
import cookieParser from "cookie-parser"
import {UserService} from "@/services/user"
import {TOKEN_NAME} from "@/model/user"
import {Errors} from "@/constants/errors"
import {verifyJWT} from "@/shared/jwt"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function saveRecoveryPhrase(req: Request<{}, {}, {phrase: string}>, res: Response) {
  const {phrase} = req.body
  const parsedCookies = cookie.parse(req.headers.cookie || "")
  const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

  if (!cookies[TOKEN_NAME]) return sendError(res, Errors.Unauthorized, 401)

  try {
    const result = verifyJWT(cookies[TOKEN_NAME])
    if (!result) return sendError(res, Errors.Unauthorized, 401)

    const user = await UserService.getUser(result.username)
    if (!user) return sendError(res, Errors.Unauthorized, 401)

    await UserService.updateUser({username: user.username, recovery_phrase: phrase})

    sendSuccess(res, {success: true})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
  }
}
