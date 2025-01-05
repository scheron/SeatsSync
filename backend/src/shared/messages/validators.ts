import {Namespace} from "../types"
import {MessageRequest} from "./types"

export function isMessageType(type: Namespace) {
  return type.startsWith(type)
}

export function validateMessage<T extends string, D>(message: unknown): message is MessageRequest<T, D> {
  if (!message || typeof message !== "object") return false

  const msg = message as Partial<MessageRequest<T, D>>
  return typeof msg.type === "string" && (typeof msg.eid === "string" || typeof msg.eid === "number") && "data" in msg
}
