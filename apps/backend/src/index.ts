import {createServer} from "http"

import {CinemaController} from "@/controllers/cinema"
import {HallController} from "@/controllers/hall"
import {UserController} from "@/controllers/user"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import {resolveMessages, WebSocketClient} from "@/core/ws"
import {env} from "@/shared/constants/env"

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

UserController.initRouter(router)

const ws = new WebSocketClient(server, {
  pingInterval: 5_000,
  autoCloseTimeout: 15_000,
  enablePingPong: true,
  onMessage: resolveMessages([CinemaController.onMessage, HallController.onMessage, UserController.onMessage]),
  onDisconnect: (ws) => {
    UserController.onDisconnect(ws)
    HallController.onDisconnect(ws)
    CinemaController.onDisconnect(ws)
  },
})

server.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}`))
server.on("close", () => ws.destroy())
