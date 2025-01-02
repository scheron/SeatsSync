import jwt from "jsonwebtoken"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {createCandidate, findUser, loginUser, registerCandidate, updateUser} from "./auth.model"
import {AuthMessageType, User} from "./auth.types"

import type {WebSocket} from "ws"

const candidates = new Map<string, {username: string; secret: string; qr_url: string; createdAt: number}>()

const JWT_SECRET = process.env.JWT_SECRET as string
const CANDIDATE_TIMEOUT = 15 * 60 * 1000

function scheduleCandidateRemoval(username: string) {
  setTimeout(() => {
    if (candidates.has(username)) {
      candidates.delete(username)
      console.log(`Candidate ${username} removed due to timeout.`)
    }
  }, CANDIDATE_TIMEOUT)
}

const handlers: Record<AuthMessageType, (data: any) => Promise<any>> = {
  "auth.start": async ({username}: {username: string}) => {
    const user = await findUser({username})
    if (user) {
      return {username: user.username, status: "user"}
    }

    if (candidates.has(username)) {
      throw new Error("Registration already in progress")
    }

    const candidate = createCandidate(username)
    candidates.set(username, candidate)
    scheduleCandidateRemoval(username)

    return {qr_url: candidate.qr_url, username, status: "candidate"}
  },

  "auth.register": async ({username, code}: {username: string; code: string}) => {
    const candidate = candidates.get(username)
    if (!candidate) {
      throw new Error("Registration not in progress")
    }

    const isRegistered = await registerCandidate({...candidate, code})
    if (!isRegistered) {
      throw new Error("Invalid token")
    }

    candidates.delete(username)

    const token = jwt.sign({username, purpose: "wink"}, JWT_SECRET, {expiresIn: "2m"})
    return {token}
  },

  "auth.login": async ({username, code}: {username: string; code: string}) => {
    const user = await loginUser(username, code)
    if (!user) {
      throw new Error("Invalid login credentials")
    }

    const token = jwt.sign({username, purpose: "wink"}, JWT_SECRET, {expiresIn: "2m"})
    return {token}
  },

  "auth.update_user": async ({username, recovery_phrase}: {username: string; recovery_phrase: string}) => {
    const user = await findUser({username})
    if (!user) {
      throw new Error("User not found")
    }

    await updateUser({username, recovery_phrase})
    return {status: "recovery_phrase_updated"}
  },
}

export async function handleAuthMessages(ws: WebSocket, {data, eid, type}: MessageRequest<AuthMessageType, User>) {
  const handler = handlers[type]
  if (!handler) {
    ws.send(formatError({eid, type, code: 404, error: "Unknown message type"}))
    return
  }

  try {
    const result = await handler(data)
    ws.send(formatSuccess({eid, type, data: result, status: "success"}))
  } catch (error) {
    ws.send(formatError({eid, type, error: error.message, code: 555}))
  }
}
