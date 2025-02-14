import {createServer} from "http"
import {initCinemaMethods} from "./methods/cinema"
import * as hallSubscription from "./subscriptions/hall"
import * as userSubscription from "./subscriptions/user"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import {WebSocketClient, WebSocketOnMessage} from "@/core/ws"
import {initUserMethods} from "@/methods/user"
import {env} from "@/constants/env"
import {Errors} from "@/constants/errors"
import {formatError} from "@/shared/messages/formatters"

import type {Namespace} from "@/shared/types"

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
  user: userSubscription.handleSubscription,
  cinema: (ws, message) => {
    initCinemaMethods(ws, message)
  },
  hall: hallSubscription.handleSubscriptions,
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
  pingInterval: 5_000,
  autoCloseTimeout: 15_000,
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
  onDisconnect: (ws) => {
    userSubscription.unsubscribe(ws)
    hallSubscription.unsubscribe(ws)
  },
})

server.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}`))
server.on("close", () => ws.destroy())
