import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT, refreshJWT} from "@/shared/jwt"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"
import {createCandidate, deleteCandidate, validateCandidate} from "../services/candidate"
import {createUser, getUser, updateUser} from "../services/user"

import type {Request, Response} from "express"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
}

export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await getUser(username)
    if (user) return sendSuccess(res, {username: user.username, status: "user"})

    const candidate = createCandidate(username)
    sendSuccess(res, {qr_url: candidate.qr_url, username, status: "candidate"})
  } catch (error) {
    logger.error("Failed to auth start", {error: (error as Error).message, username})
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
  }
}

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await getUser(username)
    if (!user) {
      throw new ApiError(Errors.UserNotFound)
    }

    validateCandidate(username, code)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie("token", newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username: user.username})
  } catch (error) {
    logger.error("Login failed", {error: (error as Error).message, username})
    sendError(res, error.message ?? Errors.InternalServerError, error.code ?? 500)
  }
}

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const candidate = validateCandidate(username, code)
    const user = await createUser(candidate.username, candidate.secret)

    deleteCandidate(username)

    const newToken = createJWT({username, sub: user.id + ""})

    res.cookie("token", newToken, COOKIE_OPTIONS)
    sendSuccess(res, {username})
  } catch (error) {
    logger.error("Registration failed", {error: (error as Error).message, username})
    sendError(res, error.message ?? Errors.InternalServerError, error.code ?? 500)
  }
}

export async function saveRecoveryPhrase(req: Request<{}, {}, {username: string; recovery_phrase: string}>, res: Response) {
  const {username, recovery_phrase} = req.body

  try {
    const token = req.cookies.token
    const newToken = refreshJWT(token)
    if (newToken && newToken !== token) {
      res.cookie("token", newToken, COOKIE_OPTIONS)
    }

    await updateUser({username, recovery_phrase})
    sendSuccess(res, {username})
  } catch (error) {
    logger.error("Failed to save recovery phrase", {error: (error as Error).message, username})
    sendError(res, error.message ?? Errors.InternalServerError, error.code ?? 500)
  }
}
