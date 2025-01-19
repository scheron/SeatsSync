import {createServer} from "http"
import {Errors} from "@/constants/errors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient, WebSocketOnMessage} from "@/core/ws"
// import {wsAuth} from "@/modules/auth"
import {handleCinemaMessages} from "@/modules/cinema/cinema.socket"
import {formatError} from "@/shared/messages/formatters"
import {initAuthMethods} from "./methods/auth"

import type {Namespace} from "@/shared/types"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

initAuthMethods(app)

const handlersMap: Partial<Record<Namespace, WebSocketOnMessage>> = {
  // Auth: wsAuth.onMessage,
  Auth: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  Cinema: handleCinemaMessages,
  Hall: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  Seat: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  TicketType: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  SeatType: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
}

const ws = new WebSocketClient(server, {
  pingInterval: 3_000,
  autoCloseTimeout: 10_000,
  enablePingPong: true,
  onMessage: (ws, message) => {
    const [namespace] = message.type.split(".")

    if (!handlersMap[namespace?.toLowerCase?.()]) {
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
      return
    }

    try {
      handlersMap[namespace?.toLowerCase?.()]?.(ws, message)
    } catch (error) {
      console.error(error)
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.InternalServerError}))
    }
  },
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => ws.destroy())
