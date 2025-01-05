import {nanoid} from "nanoid"

import type {RawData} from "ws"
import type {MessageError, MessageRequest, MessageSuccess, ResponseStatus} from "./types"

function validateMessage<T extends string, D>(message: unknown): message is MessageRequest<T, D> {
  if (!message || typeof message !== "object") return false

  const msg = message as Partial<MessageRequest<T, D>>
  return typeof msg.type === "string" && (typeof msg.eid === "string" || typeof msg.eid === "number") && "data" in msg
}

function normalizeEid(eid?: string | number): string {
  return String(eid ?? nanoid())
}

export function formatRequest<T extends string, D = unknown>(message: RawData): MessageRequest<T, D> | null {
  try {
    if (!validateMessage<T, D>(message)) {
      return null
    }
    return {
      ...message,
      eid: normalizeEid(message.eid),
      ts: Date.now(),
    }
  } catch {
    return null
  }
}

export function formatSuccess<T extends string, D = unknown>({
  eid,
  type,
  data,
  status,
}: {
  eid?: string | number
  type: T
  data: D
  status: Extract<ResponseStatus, "success" | "snapshot" | "update">
}): string {
  const response: MessageSuccess<T, D> = {
    eid: normalizeEid(eid),
    type,
    data,
    error: null,
    status,
    ts: Date.now(),
  }

  return JSON.stringify(response)
}

export function formatError<T extends string>({eid, type, error}: {eid?: string | number; type: T; error: string}): string {
  const response: MessageError<T> = {
    eid: normalizeEid(eid),
    type,
    data: null,
    error,
    status: "error",
    ts: Date.now(),
  }

  return JSON.stringify(response)
}
