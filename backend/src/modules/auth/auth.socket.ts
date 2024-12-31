import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {createCandidate, findUser, registerCandidate} from "./auth.model"
import {AuthMessageType, User} from "./auth.types"

import type {WebSocket} from "ws"

// const methods: Partial<Record<AuthMessageType, Function>> = {
//   "auth.start": async () => await getAllCinemas(),
//   "auth.login": async (data: {id: number}) => await getCinemaById(Number(data.id)),
//   "auth.register": async (data: {name: string; color: string}) => await createCinema(data),
// }

export async function handleAuthMessages(ws: WebSocket, {data = null, eid, type}: MessageRequest<AuthMessageType, User>) {
  try {
    if (!methods[type]) {
      ws.send(formatError({eid, type, code: 404, error: "Unknown message type"}))
      return
    }

    try {
      const result = await methods[type](data)
      ws.send(formatSuccess({eid, type, data: result, status: "success"}))
    } catch (error) {
      ws.send(formatError({eid, type, error: error.message, code: 555}))
    }
  } catch (error) {
    ws.send(formatError({eid: null, type: "unknown", error: "Internal Server Error", code: 500}))
  }
}

const candidates = new Map<string, {username: string; secret: string; createdAt: number}>()

const methods: Partial<Record<AuthMessageType, Function>> = {
  "auth.start": async ({username}: {username: string}, ws: WebSocket) => {
    try {
      const user = await findUser({username})

      return {username: user.username, status: "user"}
    } catch (error) {
      if (candidates.has(username)) {
        throw new Error("Registration already in progress")
      }

      const candidate = createCandidate(username)
      candidates.set(username, candidate)

      return {qr_url: candidate.qr_url, username, status: "candidate"}
    }
  },

  "auth.register": async ({username, token}: {username: string; token: string}, ws: WebSocket) => {
    const candidate = candidates.get(username)

    if (!candidate) {
      throw new Error("Registration not in progress")
    }

    const isRegistered = await registerCandidate({...candidate, token})

    // if (!isRegistered) {
    //   throw new Error("Invalid token")
    // }

    candidates.delete(username)
    return {}
  },

  "auth.login": async (data: {username: string; token: string}, ws: WebSocket) => {
    const {username, token} = data
    // const user = await loginUser(username, token)

    // if (!user) {
    //   throw new Error("Invalid login credentials")
    // }

    return {}
  },
}
