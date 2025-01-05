import {earlyResponse} from "@/shared/earlyReturn"
import {generateToken} from "@/shared/jwt"
import {candidateExists, createCandidate, deleteCandidate, getCandidate} from "../candidate"
import {findUser, loginUser, registerCandidate, updateUser} from "../model"

import type {Request, Response} from "express"

export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await findUser({username})

    res.json({username: user.username, status: "user"})
  } catch {
    if (await earlyResponse(res, candidateExists(username), 405, "Registration already in progress")) return

    const candidate = createCandidate(username)

    res.json({qr_url: candidate.qr_url, username, status: "candidate"})
  }
}

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await loginUser(username, code)
    if (await earlyResponse(res, !user, 401, "Invalid code")) return

    const newToken = generateToken({username})

    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000,
      })
      .sendStatus(201)
  } catch (e) {
    res.status(401).json(e.message)
  }
}

export async function register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const candidate = getCandidate(username)
    if (await earlyResponse(res, !candidate, 401, "Registration not in progress")) return

    const isRegistered = await registerCandidate({...candidate, code})
    if (await earlyResponse(res, !isRegistered, 401, "Invalid code")) return

    deleteCandidate(username)

    const newToken = generateToken({username})

    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000,
      })
      .sendStatus(201)
  } catch (e) {
    res.status(401).json(e.message)
  }
}

export async function saveRecoveryPhrase(req: Request<{}, {}, {username: string; recovery_phrase: string}>, res: Response) {
  try {
    const {username, recovery_phrase} = req.body

    const user = await findUser({username})
    if (await earlyResponse(res, !user, 404, "User not found")) return

    await updateUser({username, recovery_phrase})
    res.sendStatus(201)
  } catch (error) {
    res.status(401).json(error.message)
  }
}
