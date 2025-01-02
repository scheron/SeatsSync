import {createServer} from "http"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient} from "@/core/ws"
import {handshake, wink} from "@/modules/auth/auth.controller"
import {handleAuthMessages} from "@/modules/auth/auth.socket"
import {handleCinemaMessages} from "@/modules/cinema/cinema.socket"
import {formatError} from "@/shared/messages/formatters"

import type {Namespace} from "@/shared/types"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

app.post("/auth/handshake", handshake)
app.post("/auth/wink", wink)

const map: Record<Namespace, Function> = {
  auth: handleAuthMessages,
  cinema: handleCinemaMessages,
  hall: () => {},
  seat: () => {},
  ticket: () => {},
}

const ws = new WebSocketClient(server, {
  pingInterval: 3_000,
  autoCloseTimeout: 10_000,
  enablePingPong: false,
  onMessage: (ws, message) => {
    const [namespace] = message.type.split(".")

    if (!map[namespace]) {
      ws.send(formatError({eid: message.eid, type: message.type, error: "Unknown message type", code: 404}))
      return
    }

    map[namespace]?.(ws, message)
  },
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => ws.destroy())
