import {UserModel} from "@/models/user/model"
import {Errors} from "@seats-sync/constants/errors"
import cookie from "cookie"
import cookieParser from "cookie-parser"
import speakeasy from "speakeasy"
import {ApiError, WS_TOKEN_NAME} from "@/core/ws"
import {createJWT, verifyJWT} from "@/shared/lib/jwt"
import {logger} from "@/shared/lib/logger"
import {CODE_REGEX, COOKIE_OPTIONS, MAX_VALIDATION_ATTEMPTS, USERNAME_REGEX, VALIDATION_ATTEMPTS_WINDOW} from "../models/user/constants"

import type {UserStatus} from "@seats-sync/types/user"
import type {Response} from "express"

const validationAttempts = new Map<string, {count: number; resetAt: number}>()

export async function authStart(username: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  const user = await UserModel.user.get(username)
  if (user) return {username: user.username, status: "user"}

  if (UserModel.candidate.has(username)) throw new ApiError(Errors.RegistrationInProgress)

  try {
    const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`, length: 32})
    const candidate = {username, secret: secret.base32, qr_url: secret.otpauth_url, created_at: Date.now()}

    UserModel.candidate.set(username, candidate)

    logger.info("Candidate created successfully", {username})
    return {qr_url: candidate.qr_url, username, status: "candidate"}
  } catch (error) {
    logger.error("Failed to create candidate", {error: (error as Error).message, username})
    throw new ApiError(Errors.CinemaCreateFailed)
  }
}

export async function authReset(username: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    if (!UserModel.candidate.has(username)) throw new ApiError(Errors.RegistrationNotInProgress)

    UserModel.candidate.delete(username)
    validationAttempts.delete(username)
    logger.info("Candidate deleted successfully", {username})
  } catch (error) {
    logger.error("Failed to delete candidate", {error: error.message, username})
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function checkStatus(headersCookie: any) {
  const parsedCookies = cookie.parse(headersCookie || "")
  const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

  if (!cookies[WS_TOKEN_NAME]) return {status: "guest"}

  try {
    const result = verifyJWT(cookies[WS_TOKEN_NAME])
    if (!result) return {status: "guest"}

    const user = await UserModel.user.get(result.username)
    if (!user) return {status: "guest"}

    return {username: result.username, status: "user"}
  } catch (error) {
    return {status: "guest"}
  }
}

export async function login(username: string, code: string, res: Response): Promise<{status: UserStatus; username?: string}> {
  const user = await UserModel.user.get(username)
  if (!user) throw new ApiError(Errors.UserNotFound)

  const isValid = isValidCode(user.secret, code)
  if (!isValid) throw new ApiError(Errors.InvalidCode)

  const newToken = createJWT({username, sub: user.id + ""})

  res.cookie(WS_TOKEN_NAME, newToken, COOKIE_OPTIONS)

  logger.info("Setting cookie", {name: WS_TOKEN_NAME, value: newToken, options: COOKIE_OPTIONS})
  logger.info("User logged in", {username})

  return {status: "user", username: user.username}
}

export async function logout(headersCookie: any, res: Response) {
  const parsedCookies = cookie.parse(headersCookie || "")
  const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

  if (!cookies[WS_TOKEN_NAME]) throw new ApiError(Errors.Unauthorized)

  const result = verifyJWT(cookies[WS_TOKEN_NAME])
  if (!result) throw new ApiError(Errors.Unauthorized)

  res.clearCookie(WS_TOKEN_NAME)
}

export async function register(username: string, code: string, res: Response): Promise<{status: UserStatus; username?: string}> {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    const existingUser = await UserModel.user.get(username)

    if (existingUser) throw new ApiError(Errors.UserAlreadyExists)
    if (!CODE_REGEX.test(code)) throw new ApiError(Errors.InvalidCode)

    const now = Date.now()
    const attempts = validationAttempts.get(username)

    if (attempts && now < attempts.resetAt) {
      if (attempts.count >= MAX_VALIDATION_ATTEMPTS) {
        throw new ApiError(Errors.TooManyValidationAttempts)
      }

      attempts.count++
    } else {
      validationAttempts.set(username, {count: 1, resetAt: now + VALIDATION_ATTEMPTS_WINDOW})
    }

    const candidate = UserModel.candidate.get(username)
    if (!candidate) throw new ApiError(Errors.RegistrationNotInProgress)

    const isValid = isValidCode(candidate.secret, code)

    if (!isValid) {
      logger.warn("Invalid validation code", {username})
      throw new ApiError(Errors.InvalidCode)
    }

    const user = await UserModel.user.create({username, secret: candidate.secret})
    if (!user) throw new ApiError(Errors.InternalServerError)

    UserModel.candidate.delete(username)
    validationAttempts.delete(username)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie(WS_TOKEN_NAME, newToken, COOKIE_OPTIONS)
    logger.info("User registered", {username})
    return {status: "user", username: user.username}
  } catch (error) {
    logger.error("Registration failed", {error: (error as Error).message, username})
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

function isValidCode(secret: string, code: string) {
  try {
    return speakeasy.totp.verify({secret, encoding: "base32", token: code, window: 1})
  } catch (error) {
    logger.error("Failed to verify TOTP", {error: error.message})
    return false
  }
}
