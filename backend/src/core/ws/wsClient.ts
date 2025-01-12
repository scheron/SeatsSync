import {IncomingMessage, Server} from "http"
import {Errors} from "@/constants/errors"
import {WebSocket, WebSocketServer} from "ws"
import {ApiError} from "@/shared/errors/ApiError"
import {verifyJWT} from "@/shared/jwt"
import {logger, LogMessageType} from "@/shared/logger"
import {formatError, formatRequest} from "@/shared/messages/formatters"
import {RateLimiter} from "@/shared/rateLimiter"
import {Heartbeat} from "./heartbeat"

import type {RawData} from "ws"
import type {WebSocketCallbacks, WebSocketClientOptions} from "./types"

const MAX_MESSAGE_SIZE = 1024 * 1024
const MAX_CONNECTIONS = 2
const RATE_LIMIT_WINDOW = 10_000
const RATE_LIMIT_MAX_REQUESTS = 10

export class WebSocketClient {
  private ws: WebSocketServer
  private callbacks: WebSocketCallbacks
  private heartbeat?: Heartbeat
  private rateLimiter: RateLimiter
  private maxConnectionsIntervalId: NodeJS.Timeout | null = null

  constructor(server: Server, options: WebSocketClientOptions) {
    this.ws = new WebSocketServer({
      server,
      maxPayload: MAX_MESSAGE_SIZE,
      clientTracking: true,
      perMessageDeflate: true,
    })

    this.callbacks = {
      onConnect: options.onConnect ?? (() => {}),
      onDisconnect: options.onDisconnect ?? (() => {}),
      onDestroy: options.onDestroy ?? (() => {}),
      onMessage: options.onMessage ?? (() => {}),
      onSend: options.onSend ?? (() => {}),
    }

    this.rateLimiter = new RateLimiter(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW)

    this.heartbeat = new Heartbeat({
      enablePingPong: options.enablePingPong ?? true,
      pingInterval: options.pingInterval ?? 3_000,
      autoCloseTimeout: options.autoCloseTimeout ?? 10_000,
      onPingTimeout: (ws) => this.handleDisconnect(ws),
      onSend: (ws, msg) => this.callbacks.onSend?.(ws, msg),
      validateToken: (token) => this.validateToken(token),
    })

    this.heartbeat?.start()
    this.setupServerHandlers()
  }

  private setupServerHandlers() {
    this.ws.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req)
    })

    this.ws.on("error", (error: Error) => {
      this.handleServerError(error)
    })

    this.maxConnectionsIntervalId = setInterval(() => {
      if (this.ws.clients.size > MAX_CONNECTIONS) {
        logger.warn(`Max connections (${MAX_CONNECTIONS}) exceeded, refusing new connections`)
        this.ws.close()
      }
    }, 5000)
  }

  public async send(message: string, filter?: (ws: WebSocket) => boolean) {
    this.ws.clients.forEach((ws) => {
      if (filter && !filter(ws)) return
      if (ws.readyState !== WebSocket.OPEN) return

      try {
        logger.info("", {type: LogMessageType.WS_OUTGOING, data: {messageLength: message.length}})

        ws.send(message)
        this.callbacks.onSend?.(ws, message)
      } catch (error) {
        logger.error("Failed to send WS message", {error: error instanceof Error ? error.message : String(error)})

        this.handleError(ws, error as Error)
      }
    })
  }

  public destroy() {
    this.heartbeat?.stop()
    clearInterval(this.maxConnectionsIntervalId)

    this.ws.close(() => {
      this.callbacks.onDestroy?.()

      logger.info("", {type: LogMessageType.WS_DISCONNECT})
    })
  }

  private validateToken(token: string | null): boolean {
    if (!token) return false

    try {
      verifyJWT(token)
      return true
    } catch {
      return false
    }
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage) {
    if (this.ws.clients.size > MAX_CONNECTIONS) {
      ws.close(1013, Errors.TooManyConnections)
      return
    }

    const ip = req.socket.remoteAddress
    if (this.rateLimiter.isRateLimited(ip)) {
      ws.close(1008, Errors.TooManyRequests)
      return
    }

    logger.info("", {
      type: LogMessageType.WS_CONNECT,
      data: {
        userId: ws.context?.token,
      },
    })

    const token = this.extractToken(req)

    ws.context = {
      token,
      ip,
      isAuthenticated: () => this.validateToken(token),
    }

    this.setupClientHandlers(ws, token)
    this.callbacks.onConnect?.(ws)
    this.heartbeat?.addClient(ws, token)
  }

  private setupClientHandlers(ws: WebSocket, token: string | null) {
    ws.on("message", (message) => this.handleMessage(ws, message, token))
    ws.on("error", (error) => this.handleError(ws, error))
    ws.on("close", () => this.handleDisconnect(ws))
  }

  private async handleMessage(ws: WebSocket, message: RawData, token?: string) {
    const ip = ws.context?.ip

    if (this.rateLimiter.isRateLimited(ip)) {
      ws.send(formatError({error: Errors.RateLimitExceeded}))
      return
    }

    const isHeartbeat = this.heartbeat?.onMessage(ws, message) ?? false
    if (isHeartbeat) return

    try {
      let length: number

      if (message instanceof ArrayBuffer) {
        length = message.byteLength
      } else if (typeof message === "string" || Buffer.isBuffer(message)) {
        length = message.length
      } else {
        throw new Error("Unsupported data type")
      }

      const parsedMessage = JSON.parse(message.toString())

      if (!parsedMessage.type) {
        throw new ApiError(Errors.MessageTypeRequired)
      }

      logger.info("", {
        type: LogMessageType.WS_INCOMING,
        data: {
          messageId: parsedMessage.eid,
          messageType: parsedMessage.type,
          length,
          payload: JSON.stringify(parsedMessage).slice(0, 200),
        },
      })

      const requestMessage = formatRequest(parsedMessage)

      if (!requestMessage) {
        throw new ApiError(Errors.UnknownMessageType)
      }

      this.rateLimiter.increment(ip)
      this.callbacks.onMessage?.(ws, requestMessage)
    } catch (error) {
      this.handleError(ws, error as Error)
    }
  }

  private handleError(ws: WebSocket, error: Error) {
    logger.error("", {
      type: LogMessageType.WS_ERROR,
      data: {
        error: error.message,
        ip: ws.context?.ip,
        isAuthenticated: ws.context?.isAuthenticated(),
      },
    })

    if (error instanceof ApiError) {
      ws.send(formatError({error: error.code}))
      return
    }

    ws.send(formatError({error: Errors.InternalServerError}))
  }

  private handleServerError(error: Error) {
    logger.error("", {type: LogMessageType.WS_SERVER_ERROR, data: {error: error.message}})
  }

  private handleDisconnect(ws: WebSocket) {
    logger.info("", {type: LogMessageType.WS_DISCONNECT, data: {ip: ws.context?.ip}})

    this.heartbeat?.removeClient(ws)
    this.callbacks.onDisconnect?.(ws)
  }

  private extractToken(req: IncomingMessage): string | null {
    const token = req.headers.authorization?.split(" ")[1]
    return token || null
  }
}
