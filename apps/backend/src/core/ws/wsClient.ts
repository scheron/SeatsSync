import {Errors} from "@seats-sync/constants/errors"
import cookie from "cookie"
import cookieParser from "cookie-parser"
import {nanoid} from "nanoid"
import {WebSocket, WebSocketServer} from "ws"
import {ApiError} from "@/core/ws"
import {formatError, formatRequest} from "@/core/ws/messages"
import {decodeJWT, verifyJWT} from "@/shared/lib/jwt"
import {logger, LogMessageType} from "@/shared/lib/logger"
import {WS_TOKEN_NAME} from "./constants"
import {Heartbeat} from "./heartbeat"

import type {IncomingMessage, Server} from "http"
import type {RawData} from "ws"
import type {IWebSocketClient, WebSocketCallbacks, WebSocketClientOptions} from "./types"

const MAX_MESSAGE_SIZE = 1024 * 1024

export class WebSocketClient {
  private id: string
  private ws: WebSocketServer
  private callbacks: WebSocketCallbacks
  private heartbeat?: Heartbeat
  private clients: Map<string, IWebSocketClient> = new Map()

  constructor(server: Server, options: WebSocketClientOptions) {
    this.ws = new WebSocketServer({server, maxPayload: MAX_MESSAGE_SIZE, clientTracking: true})
    this.id = nanoid()

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
      onPingTimeout: (ws) => this.handleDisconnect(ws),
      onSend: (ws, msg) => this.callbacks.onSend?.(ws, msg),
      validateToken: (token) => this.validateToken(token),
    })

    this.heartbeat?.start()
    this.setupServerHandlers()
  }

  public getConnectedClientCount(): number {
    return this.clients.size
  }

  public getConnectedClientIds(): string[] {
    return Array.from(this.clients.keys())
  }

  public async send(message: string, filter?: (ws: WebSocket) => boolean) {
    this.ws.clients.forEach((ws) => {
      if (filter && !filter(ws)) return false
      if (ws.readyState !== WebSocket.OPEN) return false

      try {
        logger.info("", {type: LogMessageType.WS_OUTGOING, data: {messageLength: message.length}})

        ws.send(message)
        this.callbacks.onSend?.(ws, message)
        return true
      } catch (error) {
        logger.error("Failed to send WS message", {error: error instanceof Error ? error.message : String(error)})

        this.handleError(ws, error as Error)
        return false
      }
    })
  }

  public async sendToClient(clientId: string, message: string): Promise<boolean> {
    const client = this.clients.get(clientId)
    if (!client || client.readyState !== WebSocket.OPEN) return false

    try {
      logger.info("", {type: LogMessageType.WS_OUTGOING, data: {clientId, messageLength: message.length}})

      client.send(message)
      this.callbacks.onSend?.(client, message)
      return true
    } catch (error) {
      logger.error("Failed to send WS message to client", {clientId, error: error instanceof Error ? error.message : String(error)})

      this.handleError(client, error as Error)
      return false
    }
  }

  public destroy() {
    this.heartbeat?.stop()
    this.clients.clear()

    this.ws.close(() => {
      this.callbacks.onDestroy?.()
      logger.info("", {type: LogMessageType.WS_DISCONNECT})
    })
  }

  private setupServerHandlers() {
    this.ws.on("connection", (ws: IWebSocketClient, req: IncomingMessage) => this.handleConnection(ws, req))
    this.ws.on("error", (error: Error) => this.handleServerError(error))
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

  private handleConnection(ws: IWebSocketClient, req: IncomingMessage) {
    const clientId = nanoid()
    ws.id = clientId

    logger.info("", {
      type: LogMessageType.WS_CONNECT,
      data: {clientId, serverInstanceId: this.id},
    })

    const token = this.extractToken(req)

    ws.context = {
      id: clientId,
      token,
      username: () => decodeJWT(token)?.username ?? null,
      isAuthenticated: () => this.validateToken(token),
    }

    this.clients.set(clientId, ws)

    this.setupClientHandlers(ws)
    this.callbacks.onConnect?.(ws)
    this.heartbeat?.addClient(ws, token)
  }

  private setupClientHandlers(ws: IWebSocketClient) {
    ws.on("message", (message) => this.handleMessage(ws, message))
    ws.on("error", (error) => this.handleError(ws, error))
    ws.on("close", () => this.handleDisconnect(ws))
  }

  private async handleMessage(ws: IWebSocketClient, message: RawData) {
    const isHeartbeat = this.heartbeat?.onMessage(ws, message) ?? false
    if (isHeartbeat) return

    try {
      const parsedMessage = JSON.parse(message.toString())

      if (!parsedMessage.type) {
        throw new ApiError(Errors.MessageTypeRequired)
      }

      logger.info("", {
        type: LogMessageType.WS_INCOMING,
        data: {
          clientId: ws.id,
          messageId: parsedMessage?.eid,
          messageType: parsedMessage?.type,
          payload: JSON.stringify(parsedMessage?.data).slice(0, 200),
        },
      })

      const requestMessage = formatRequest(parsedMessage)

      if (!requestMessage) {
        throw new ApiError(Errors.UnknownMessageType)
      }

      this.callbacks.onMessage?.(ws, requestMessage)
    } catch (error) {
      this.handleError(ws, error as Error)
    }
  }

  private handleError(ws: WebSocket, error: Error) {
    const clientId = (ws as IWebSocketClient).id
    logger.error("", {type: LogMessageType.WS_ERROR, data: {clientId, error: error.message}})

    if (error instanceof ApiError) {
      ws.send(formatError({error: error.code}))
      return
    }

    ws.send(formatError({error: Errors.InternalServerError}))
  }

  private handleServerError(error: Error) {
    logger.error("", {type: LogMessageType.WS_SERVER_ERROR, data: {serverInstanceId: this.id, error: error.message}})
  }

  private handleDisconnect(ws: IWebSocketClient) {
    const clientId = ws.id
    logger.info("", {type: LogMessageType.WS_DISCONNECT, data: {clientId}})

    if (clientId) this.clients.delete(clientId)

    this.heartbeat?.removeClient(ws)
    this.callbacks.onDisconnect?.(ws)
  }

  private extractToken(req: IncomingMessage): string | null {
    const parsedCookies = cookie.parse(req.headers.cookie || "")
    const cookies = cookieParser.signedCookies(parsedCookies, process.env.COOKIE_SECRET || "")

    return cookies[WS_TOKEN_NAME] || null
  }
}
