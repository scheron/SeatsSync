import cookie from "cookie"
import cookieParser from "cookie-parser"
import {WS_TOKEN_NAME} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT, verifyJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"
import {COOKIE_OPTIONS} from "./user.constants"
import * as UserService from "./user.service"
import {notifyUpdate} from "./user.subscription"

import type {Request, Response} from "express"

export async function authReset(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    UserService.deleteCandidate(username)
    sendSuccess(res, {})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Failed to reset", {error: (error as Error).message, username})
  }
}

export async function authStart(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await UserService.getUser(username)
    if (user) return sendSuccess(res, {username: user.username, status: "user"})

    try {
      const candidate = UserService.createCandidate(username)
      sendSuccess(res, {qr_url: candidate.qr_url, username, status: "candidate"})
    } catch (error) {
      sendError(res, error.message ?? Errors.InternalServerError)
      logger.error("Failed to create candidate", {error: (error as Error).message, username})
    }
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Failed to get user", {error: (error as Error).message, username})
  }
}

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await UserService.getUser(username)
    if (!user) throw new ApiError(Errors.UserNotFound)

    const isValid = UserService.isValidCode(user.secret, code)
    if (!isValid) throw new ApiError(Errors.InvalidCode)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie(WS_TOKEN_NAME, newToken, COOKIE_OPTIONS)
    logger.info("Setting cookie", {
      name: WS_TOKEN_NAME,
      value: newToken,
      options: COOKIE_OPTIONS,
    })

    sendSuccess(res, {username: user.username})
    notifyUpdate({status: "user", username: user.username})
    logger.info("User logged in", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Login failed", {error: (error as Error).message, username})
  }
}

export async function logout(req: Request<{}, {}, {}>, res: Response) {
  const parsedCookies = cookie.parse(req.headers.cookie || "")
  const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

  if (!cookies[WS_TOKEN_NAME]) {
    return sendError(res, Errors.Unauthorized, 401)
  }
  try {
    const result = verifyJWT(cookies[WS_TOKEN_NAME])

    if (!result) {
      return sendError(res, Errors.Unauthorized, 401)
    }

    res.clearCookie(WS_TOKEN_NAME)
    notifyUpdate({status: "guest"})
    sendSuccess(res, {success: true})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
  }
}

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const existingUser = await UserService.getUser(username)
    if (existingUser) return sendError(res, Errors.UserAlreadyExists, 400)

    const candidate = UserService.validateCandidate(username, code)
    const user = await UserService.createUser(candidate.username, candidate.secret)

    UserService.deleteCandidate(username)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie(WS_TOKEN_NAME, newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username})
    notifyUpdate({status: "user", username: user.username})
    logger.info("User registered", {username})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
    logger.error("Registration failed", {error: (error as Error).message, username})
  }
}

export async function saveRecoveryPhrase(req: Request<{}, {}, {phrase: string}>, res: Response) {
  const {phrase} = req.body
  const parsedCookies = cookie.parse(req.headers.cookie || "")
  const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

  if (!cookies[WS_TOKEN_NAME]) return sendError(res, Errors.Unauthorized, 401)

  try {
    const result = verifyJWT(cookies[WS_TOKEN_NAME])
    if (!result) return sendError(res, Errors.Unauthorized, 401)

    const user = await UserService.getUser(result.username)
    if (!user) return sendError(res, Errors.Unauthorized, 401)

    await UserService.updateUser({username: user.username, recovery_phrase: phrase})

    sendSuccess(res, {success: true})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError)
  }
}
