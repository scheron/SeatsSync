import dotenv from "dotenv"
import express from "express"
import http from "http"
import {WebSocketServer} from "ws"
import {onMessage} from "./sockets/cinemas.socket"
import {getAllCinemas} from "./models/cinemas.model"

dotenv.config()

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({server})

// TODO: Only single connection is allowed;
// TODO: Need ping/pong to keep connection alive?
wss.on("connection", (ws) => {
  console.log("connected")

  ws.on("message", (message) => {
    // if(handlePingMessage(ws,message))return
    if (message.toString() === "ping") {
      console.log("ping")
      ws.send("pong")
    }

    console.log("received: %s", message)

    onMessage(ws, message)
  })

  ws.on("close", () => {
    console.log("disconnected")
  })
})

app.get("/", (req, res) => {
  res.send("Hello from server")
})

app.get("/cinemas", async (req, res) => {
  res.send(await getAllCinemas())
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
