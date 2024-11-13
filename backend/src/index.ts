import express from "express"
import WebSocket from "ws"
import {query} from "@config/db"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
