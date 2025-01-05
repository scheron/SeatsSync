import {WebSocketContext} from "@/core/ws/types"
import {verifyJWT} from "@/shared/jwt"
import {getUser} from "../services/user"
import {AuthMessageType} from "../types"

export const handlers: Record<AuthMessageType, (data: any, context: WebSocketContext) => Promise<any>> = {
  "auth.status": async (_, context) => {
    try {
      console.log(context, context.isAuthenticated())
      if (!context?.isAuthenticated()) return {status: "guest", data: null}

      const token = context?.token
      const payload = verifyJWT(token)
      const user = await getUser(payload.username)

      return {data: {username: user.username, id: user.id}, status: "user"}
    } catch {
      return {status: "guest", data: null}
    }
  },
}
