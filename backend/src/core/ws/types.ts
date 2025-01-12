import {MessageRequest} from "@/shared/messages/types"

import type {WebSocket} from "ws"

declare module "ws" {
  interface WebSocket {
    context?: WebSocketContext
  }
}

export type WebSocketClientOptions = {
  pingMsg?: string | number
  pingInterval?: number
  autoCloseTimeout?: number
  enablePingPong?: boolean
} & WebSocketCallbacks

export type WebSocketCallbacks = {
  onConnect?: (ws: WebSocket) => void
  onDisconnect?: (ws: WebSocket) => void
  onDestroy?: () => void
  onMessage?: (ws: WebSocket, message: MessageRequest<any, any>) => void
  onSend?: (ws: WebSocket, message: string) => void
}

export type WebSocketContext = {
  token: string | null
  ip: string | undefined
  isAuthenticated: () => boolean
}
