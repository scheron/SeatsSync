import {createServer} from "http"
import {Errors} from "@/constants/errors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient} from "@/core/ws"
import {wsAuth} from "@/modules/auth"
import {initAuthRoutes} from "@/modules/auth/http/routes"
import {handleCinemaMessages} from "@/modules/cinema/cinema.socket"
import {formatError} from "@/shared/messages/formatters"

import type {Namespace} from "@/shared/types"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

initAuthRoutes(app)

const map: Record<Namespace, Function> = {
  auth: wsAuth.onMessage,
  cinema: handleCinemaMessages,
  hall: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  seat: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  ticket: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
}

const ws = new WebSocketClient(server, {
  pingInterval: 3_000,
  autoCloseTimeout: 10_000,
  enablePingPong: true,
  onMessage: (ws, message) => {
    const [namespace] = message.type.split(".")

    if (!map[namespace]) {
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
      return
    }

    try {
      map[namespace]?.(ws, message)
    } catch (error) {
      console.error(error)
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.InternalServerError}))
    }
  },
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => ws.destroy())
