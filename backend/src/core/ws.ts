import {Server} from "http"
import {RawData, WebSocket, WebSocketServer} from "ws"
import {logger} from "@/shared/logger"

type WebSocketCallbacks = {
  onConnect?: (ws: WebSocket) => void
  onDisconnect?: (ws: WebSocket) => void
  onDestroy?: () => void
  onMessage?: (ws: WebSocket, message: RawData) => void
  onSend?: (ws: WebSocket, message: string) => void
}
type WebSocketClientOptions = {
  pingMsg?: string | number
  pingInterval?: number
  autoCloseTimeout?: number
} & WebSocketCallbacks

export class WebSocketClient {
  private ws: WebSocketServer
  private pingInterval: number
  private autoCloseTimeout: number
  private clients: WeakMap<WebSocket, {lastPingTime: number}>
  private callbacks: WebSocketCallbacks
  private checkStateIntervalId: NodeJS.Timeout

  constructor(server: Server, options: WebSocketClientOptions) {
    this.clients = new WeakMap<WebSocket, {lastPingTime: number}>()

    this.pingInterval = options.pingInterval ?? 3_000
    this.autoCloseTimeout = options.autoCloseTimeout ?? 10_000

    this.callbacks = {
      onConnect: options.onConnect ?? (() => {}),
      onDisconnect: options.onDisconnect ?? (() => {}),
      onDestroy: options.onDestroy ?? (() => {}),
      onMessage: options.onMessage ?? (() => {}),
      onSend: options.onSend ?? (() => {}),
    }

    this.ws = new WebSocketServer({server})

    this.setupConnectionHandling()
    this.checkState()
  }

  send(message: string, filter?: (ws: WebSocket) => boolean) {
    this.ws.clients.forEach((ws) => {
      if (filter && !filter(ws)) return
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message))
    })
  }

  destroy() {
    clearInterval(this.checkStateIntervalId)

    this.ws.clients.forEach((ws) => ws.terminate())
    this.ws.close()
    this.clients = new WeakMap()
    this.checkStateIntervalId = null

    this.callbacks.onDestroy?.()

    logger.info("WebSocket server destroyed")
  }

  private setupConnectionHandling() {
    this.ws.on("connection", (ws) => this.handleConnection(ws))
  }

  private handleConnection(ws: WebSocket) {
    logger.info("New client connected")

    this.clients.set(ws, {lastPingTime: Date.now()})
    this.callbacks.onConnect?.(ws)

    ws.on("message", (message) => this.handleMessage(ws, message))
    ws.on("close", () => this.handleClose(ws))
    ws.on("error", (error) => this.handleError(ws, error))
    ws.on("ping", (data) => console.log("ping", data))
  }

  private handleMessage(ws: WebSocket, message: RawData) {
    const client = this.clients.get(ws)
    if (!client) return

    client.lastPingTime = Date.now()

    if (message.toString() === "1") {
      ws.send("1")
      return
    }

    try {
      const parsedMessage = JSON.parse(message.toString())

      if (!parsedMessage.type) {
        ws.send(JSON.stringify({error: "Message type is required"}))
        return
      }

      this.callbacks.onMessage?.(ws, parsedMessage)
    } catch (error) {
      logger.error("Invalid message format: ", {error: error.message})
      ws.send(JSON.stringify({error: "Invalid message format"}))
      ws.terminate()
    }
  }

  private handleClose(ws: WebSocket) {
    this.clients.delete(ws)
    this.callbacks.onDisconnect?.(ws)
  }

  private handleError(ws: WebSocket, error: Error) {
    logger.error("WebSocket error: ", {error: error.message})
    ws.terminate()
  }

  private checkState() {
    this.checkStateIntervalId = setInterval(() => {
      this.ws.clients.forEach((ws) => {
        const client = this.clients.get(ws)
        if (!client) return

        const now = Date.now()

        if (now - client.lastPingTime > this.autoCloseTimeout) {
          logger.warn("Client did not respond to ping within timeout. Terminating connection.")

          ws.terminate()
          this.clients.delete(ws)
          this.callbacks.onDisconnect?.(ws)

          return
        }

        if (now - client.lastPingTime > this.pingInterval) {
          try {
            ws.send("1")
            this.callbacks.onSend?.(ws, "1")
          } catch (error) {
            logger.error("Failed to send ping: ", {error: error.message})
            ws.terminate()
            this.clients.delete(ws)
          }
        }
      })
    }, this.pingInterval)
  }
}
