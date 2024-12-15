import {createServer} from "http"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import {WebSocketClient} from "@/core/ws"
import {handleCinemaSocketMessage} from "@/modules/cinema/cinema.socket"

import type {Request, Response} from "express"

dotenv.config()

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

const users: Map<string, {secret: string}> = new Map()

app.get("/auth/users", (req: Request, res: Response) => {
  res.json(Array.from(users.values()))
})

app.post("/auth/register", (req: Request, res: Response) => {
  const {username} = req.body

  if (!username) {
    return res.status(400).json({error: "Username is required"})
  }

  if (users.has(username)) {
    return res.status(400).json({error: "User already exists"})
  }

  const secret = speakeasy.generateSecret({
    name: `SeatsSync ${username}`,
    length: 20,
  })

  users.set(username, {secret: secret.base32})

  res.json({
    otpauth_url: secret.otpauth_url,
    secret: secret.base32,
  })
})

app.post("/auth/login", (req: Request, res: Response) => {
  const {username, token} = req.body

  if (!username || !token) return res.status(400).json({error: "Username and token are required"})

  const user = users.get(username)

  if (!user) return res.status(404).json({error: "User not found"})

  const isValid = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "base32",
    token,
    window: 1,
  })

  if (!isValid) return res.status(401).json({error: "Invalid token"})

  const refreshToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "5d"})

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000,
  })

  res.json({message: "Logged in successfully"})
})

// const ws = new WebSocketClient(server, {
//   pingInterval: 3000,
//   autoCloseTimeout: 10_000,
//   onMessage: (ws, message) => {
//     handleCinemaSocketMessage(ws, message)
//   },
// })

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
server.on("close", () => users.clear())
// server.on("close", () => ws.destroy())
