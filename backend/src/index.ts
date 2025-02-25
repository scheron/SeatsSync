import {createServer} from "http"
import {resolveMessage} from "./core/ws/resolveMessages"
import * as cinemaMethods from "./methods/cinema"
import * as hallSubscription from "./subscriptions/hall"
import * as userSubscription from "./subscriptions/user"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import {WebSocketClient} from "@/core/ws"
import {initUserMethods} from "@/methods/user"
import {env} from "@/constants/env"

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

const ws = new WebSocketClient(server, {
  pingInterval: 5_000,
  autoCloseTimeout: 15_000,
  enablePingPong: true,
  onMessage: resolveMessage([
    cinemaMethods.onMessage,
    userSubscription.onMessage,
    hallSubscription.onMessage, //
  ]),
  onDisconnect: (ws) => {
    userSubscription.unsubscribe(ws)
    hallSubscription.unsubscribe(ws)
  },
})

server.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}`))
server.on("close", () => ws.destroy())
