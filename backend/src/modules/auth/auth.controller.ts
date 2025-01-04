import jwt from "jsonwebtoken"
import {earlyResponse} from "@/shared/earlyReturn"
import {createCandidate, findUser, loginUser, registerCandidate, updateUser} from "./auth.model"

import type {Request, Response} from "express"

const JWT_SECRET = process.env.JWT_SECRET as string

const CANDIDATE_TIMEOUT = 5 * 60 * 1000
const candidates = new Map<string, {username: string; secret: string; qr_url: string; createdAt: number}>()

function scheduleCandidateRemoval(username: string) {
  setTimeout(() => {
    if (candidates.has(username)) {
      candidates.delete(username)
      console.log(`Candidate ${username} removed due to timeout.`)
    }
  }, CANDIDATE_TIMEOUT)
}

export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await findUser({username})

    res.json({username: user.username, status: "user"})
  } catch {
    if (await earlyResponse(res, candidates.has(username), 405, "Registration already in progress")) return

    const candidate = createCandidate(username)

    candidates.set(username, candidate)
    scheduleCandidateRemoval(username)

    res.json({qr_url: candidate.qr_url, username, status: "candidate"})
  }
}

export async function login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
  const {username, code} = req.body

  try {
    const user = await loginUser(username, code)
    if (await earlyResponse(res, !user, 401, "Invalid code")) return

    const newToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

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
    const candidate = candidates.get(username)
    if (await earlyResponse(res, !candidate, 401, "Registration not in progress")) return

    const isRegistered = await registerCandidate({...candidate, code})
    if (await earlyResponse(res, !isRegistered, 401, "Invalid code")) return

    candidates.delete(username)

    const newToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

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
