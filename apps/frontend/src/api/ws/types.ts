import type {Method} from "@seats-sync/constants/methods"
import type {Subscription} from "@seats-sync/constants/subscriptions"
import type {MessageError, MessageRequest, MessageSuccess} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"

export type MessageType = Method | Subscription | "*"

export type SubscriptionOptions<T = any, D = any> = {
  msg?: PartialDeep<MessageRequest<D>>
  onSnapshot?: (data: T) => void
  onUpdate?: (data: T) => void
  onResult?: (msg: MessageSuccess<T>) => void
  onError?: (msg: MessageError) => void
  onDelete?: () => void
  isKeepAlive?: boolean
  isOnce?: boolean
}

export type ResponseMessage<T = any> = MessageSuccess<T> | MessageError
export type PingMessage = 1
export type WebSocketMessage<T> = ResponseMessage<T> | PingMessage

export function isErrorMessage<T>(message: ResponseMessage<T>): message is MessageError {
  return message.status === "error" && message.error !== null
}

export function isSuccessMessage<T>(message: ResponseMessage<T>): message is MessageSuccess<T> {
  return message.status !== "error" && message.error === null
}

export type ConnectionState = "DISCONNECTED" | "CONNECTING" | "RECONNECTING" | "CONNECTED" | "DESTROYED" | "INITIALIZED"
