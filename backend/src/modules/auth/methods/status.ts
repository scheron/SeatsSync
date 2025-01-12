import {DB} from "@/core/db"
import {verifyJWT} from "@/shared/jwt"

import type {IWebSocketClient} from "@/core/ws/types"
import type {StatusResponse} from "../types"

const userDb = new DB("user")

export async function getStatus(ws: IWebSocketClient): Promise<StatusResponse> {
  try {
    if (!ws.isAuthenticated?.()) {
      return {status: "guest", data: null}
    }

    const token = ws.token
    const payload = verifyJWT(token)

    const userResult = await userDb.findOne({username: payload.username})
    if (!userResult.success) {
      return {status: "guest", data: null}
    }

    const user = userResult.data!
    return {
      status: "user",
      data: {
        username: user.username,
        id: user.id,
      },
    }
  } catch {
    return {status: "guest", data: null}
  }
}
