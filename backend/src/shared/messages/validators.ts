import {Namespaces} from "@/constants/namespaces"

import type {Namespace} from "@/shared/types"
import type {MessageRequest} from "./types"

const MAX_MESSAGE_SIZE = 1024 * 1024
const MAX_DATA_SIZE = 100 * 1024

export function isMessageType(type: string): type is keyof typeof Namespaces {
  return Object.values(Namespaces).includes(type as Namespace)
}

export function validateMessage<T extends string, D>(message: unknown): message is MessageRequest<T, D> {
  if (!message || typeof message !== "object") return false

  const msg = message as Partial<MessageRequest<T, D>>

  if (typeof msg.type !== "string" || !msg.type) return false
  if (!msg.eid || (typeof msg.eid !== "string" && typeof msg.eid !== "number")) return false
  if (!("data" in msg)) return false

  const messageSize = JSON.stringify(message).length
  if (messageSize > MAX_MESSAGE_SIZE) return false

  if (msg.data !== undefined) {
    const dataSize = JSON.stringify(msg.data).length
    if (dataSize > MAX_DATA_SIZE) return false
  }

  return true
}
