import http from "http"
import dotenv from "dotenv"
import express from "express"
import {WebSocketClient} from "@/core/ws"
import {handleCinemaSocketMessage} from "@/modules/cinema/cinema.socket"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)

const ws = new WebSocketClient(server, {
  pingInterval: 3000,
  autoCloseTimeout: 10_000,
  onMessage: (ws, message) => {
    handleCinemaSocketMessage(ws, message)
  },
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => ws.destroy())
