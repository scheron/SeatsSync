import {createServer} from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import {resolveMessage, WebSocketClient} from "@/core/ws"
import {CinemaController, CinemaSubscription} from "@/modules/cinema"
import {HallController, HallSubscription} from "@/modules/hall"
import {UserController, UserSubscription} from "@/modules/user"
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

UserController.initUserMethods(router)

const ws = new WebSocketClient(server, {
  pingInterval: 5_000,
  autoCloseTimeout: 15_000,
  enablePingPong: true,
  onMessage: resolveMessage([
    //
    CinemaController.onMessage,
    UserController.onMessage,
    HallController.onMessage,
  ]),
  onDisconnect: (ws) => {
    UserSubscription.unsubscribe(ws)
    HallSubscription.unsubscribe(ws)
    CinemaSubscription.unsubscribe(ws)
  },
})

server.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}`))
server.on("close", () => ws.destroy())
