import {Errors} from "@/constants/errors"
import {earlyResponse} from "@/shared/earlyReturn"
import {createJWT} from "@/shared/jwt"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {sendError, sendSuccess} from "@/shared/messages/responses"
import {candidateModel} from "../model/candidate"
import {userModel} from "../model/user"
import {createCandidate, deleteCandidate, validateCandidate} from "../services/candidate"
import {createUser, getUser, updateUser} from "../services/user"

import type {Request, Response} from "express"

export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await getUser(username)
    if (user) return sendSuccess(res, {username: user.username, status: "user"})
  } catch {
    try {
      const candidate = createCandidate(username)
      sendSuccess(res, {qr_url: candidate.qr_url, username, status: "candidate"})
    } catch (e) {
      sendError(res, e.message ?? Errors.InternalError, e.code)
    }
  }
}

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await getUser(username)
    validateCandidate(username, code)

    const newToken = createJWT({username})

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })
    sendSuccess(res, {username: user.username})
  } catch (e) {
    sendError(res, e.message)
  }
}

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const candidate = validateCandidate(username, code)

    await createUser(candidate.username, candidate.secret)
    deleteCandidate(username)

    const newToken = createJWT({username})

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })
    sendSuccess(res, {username})
  } catch (e) {
    sendError(res, e.message)
  }
}

export async function saveRecoveryPhrase(req: Request<{}, {}, {username: string; recovery_phrase: string}>, res: Response) {
  try {
    const {username, recovery_phrase} = req.body

    await updateUser({username, recovery_phrase})

    sendSuccess(res, {username})
  } catch (error) {
    sendError(res, error.message)
  }
}
