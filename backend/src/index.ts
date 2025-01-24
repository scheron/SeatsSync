import {createServer} from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient, WebSocketOnMessage} from "@/core/ws"
import {initUserMethods} from "@/methods/user"
import {handleUserMessages} from "@/subscriptions/user"
import {Errors} from "@/constants/errors"
import {formatError} from "@/shared/messages/formatters"

import type {Namespace} from "@/shared/types"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const router = express.Router()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET || ""))
app.use(
  cors({
    origin: [/localhost/],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
  }),
)
app.use("/api", router)

initUserMethods(router)

const handlersMap: Partial<Record<Namespace, WebSocketOnMessage>> = {
  user: handleUserMessages,
  cinema: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  hall: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  seat: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  ticket_type: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
  seat_type: (ws, message) => {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.NotImplemented}))
  },
}

const ws = new WebSocketClient(server, {
  pingInterval: 3_000,
  autoCloseTimeout: 10_000,
  enablePingPong: true,
  onMessage: (ws, message) => {
    const [namespace] = message.type.split(".")

    if (!handlersMap[namespace]) {
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
