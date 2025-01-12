import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {verifyJWT} from "@/shared/jwt"

import type {MessageHandler} from "@/shared/messages/types"
import type {StatusResponse} from "./types"

const userDb = new DB("user")

export const getAuthStatus: MessageHandler<null, StatusResponse> = async (_, meta, ws) => {
  try {
    if (!(ws as any).isAuthenticated?.()) {
      return {status: "guest", data: null}
    }

    const token = (ws as any).token
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
