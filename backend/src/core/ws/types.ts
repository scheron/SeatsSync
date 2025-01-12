import {MessageRequest} from "@/shared/messages/types"

import type {WebSocket} from "ws"

export type IWebSocketClient = WebSocket & {context?: WebSocketContext}

export type WebSocketOnMessage = (ws: IWebSocketClient, message: MessageRequest<any, any>) => void

export type WebSocketClientOptions = {
  pingMsg?: string | number
  pingInterval?: number
  autoCloseTimeout?: number
  enablePingPong?: boolean
} & WebSocketCallbacks

export type WebSocketCallbacks = {
  onConnect?: (ws: IWebSocketClient) => void
  onDisconnect?: (ws: IWebSocketClient) => void
  onDestroy?: () => void
  onMessage?: WebSocketOnMessage
  onSend?: (ws: IWebSocketClient, message: string) => void
}

export type WebSocketContext = {
  token: string | null
  isAuthenticated: () => boolean
}
