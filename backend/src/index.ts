import {createServer} from "http"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient} from "@/core/ws"
import {loginUser, registerUser, saveRecoveryPhrase} from "@/modules/auth/auth.controller"
import {handleCinemaMessages} from "@/modules/cinema/cinema.socket"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

app.post("/auth/register", registerUser)
app.post("/auth/login", loginUser)
app.post("/auth/recovery", saveRecoveryPhrase)

const ws = new WebSocketClient(server, {
  pingInterval: 3_000,
  autoCloseTimeout: 10_000,
  onMessage: (ws, message) => {
    handleCinemaMessages(ws, message)
  },
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => ws.destroy())
