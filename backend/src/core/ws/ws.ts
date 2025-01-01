import {Server} from "http"
import {RawData, WebSocket, WebSocketServer} from "ws"
import {logger} from "@/shared/logger"
import {formatRequest} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {Heartbeat} from "./heartbeat"

type WebSocketCallbacks = {
  onConnect?: (ws: WebSocket) => void
  onDisconnect?: (ws: WebSocket) => void
  onDestroy?: () => void
  onMessage?: (ws: WebSocket, message: MessageRequest<any, any>) => void
  onSend?: (ws: WebSocket, message: string) => void
}

export type WebSocketClientOptions = {
  pingMsg?: string | number
  pingInterval?: number
  autoCloseTimeout?: number
  enablePingPong?: boolean
} & WebSocketCallbacks

export class WebSocketClient {
  private ws: WebSocketServer
  private callbacks: WebSocketCallbacks
  private heartbeat?: Heartbeat

  constructor(server: Server, options: WebSocketClientOptions) {
    this.ws = new WebSocketServer({server})

    this.callbacks = {
      onConnect: options.onConnect ?? (() => {}),
      onDisconnect: options.onDisconnect ?? (() => {}),
      onDestroy: options.onDestroy ?? (() => {}),
      onMessage: options.onMessage ?? (() => {}),
      onSend: options.onSend ?? (() => {}),
    }

    this.heartbeat = new Heartbeat({
      enablePingPong: options.enablePingPong ?? true,
      pingInterval: options.pingInterval ?? 3_000,
      autoCloseTimeout: options.autoCloseTimeout ?? 10_000,
      onPingTimeout: (ws) => this.callbacks.onDisconnect?.(ws),
      onSend: (ws, msg) => this.callbacks.onSend?.(ws, msg),
    })

    this.heartbeat?.start()

    this.ws.on("connection", (ws) => this.handleConnection(ws))
  }

  send(message: string, filter?: (ws: WebSocket) => boolean) {
    this.ws.clients.forEach((ws) => {
      if (filter && !filter(ws)) return

      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message))
    })
  }

  destroy() {
    this.heartbeat?.stop()

    this.ws.clients.forEach((ws) => ws.terminate())
    this.ws.close()

    this.callbacks.onDestroy?.()

    logger.info("WebSocket server destroyed")
  }

  private handleConnection(ws: WebSocket) {
    logger.info("New client connected")

    this.callbacks.onConnect?.(ws)
    this.heartbeat?.addClient(ws)

    ws.on("message", (message) => this.handleMessage(ws, message))
    ws.on("error", (error) => this.handleError(ws, error))
    ws.on("close", () => this.handleDisconnect?.(ws))
  }

  private handleMessage(ws: WebSocket, message: RawData) {
    const isHeartbeat = this.heartbeat?.onUserMessage(ws, message) ?? false
    if (isHeartbeat) return

    try {
      const parsedMessage = JSON.parse(message.toString())

      if (!parsedMessage.type) {
        ws.send(JSON.stringify({error: "Message type is required"}))
        return
      }

      const request = formatRequest(parsedMessage)

      if (!request) {
        throw Error(JSON.stringify({message}))
        return
      }

      this.callbacks.onMessage?.(ws, request)
    } catch (error) {
      logger.error("Invalid message format: ", {error: error.message})
      ws.send(JSON.stringify({error: "Invalid message format"}))
      ws.terminate()
    }
  }

  private handleError(ws: WebSocket, error: Error) {
    logger.error("WebSocket error: ", {error: error.message})
    ws.terminate()
  }

  private handleDisconnect(ws: WebSocket) {
    logger.info("Client disconnected")
    this.heartbeat?.removeClient(ws)
  }
}
