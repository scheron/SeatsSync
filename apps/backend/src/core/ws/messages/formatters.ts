import {objectFilter} from "@seats-sync/utils/objects"
import {nanoid} from "nanoid"
import {validateMessage} from "./validators"

import type {MessageError, MessageRequest, MessageSuccess, ResponseStatus} from "@seats-sync/types/websocket"

function normalizeEid(eid?: string | number): string {
  return String(eid ?? nanoid())
}

export function formatRequest<D = unknown>(message: MessageRequest<D>): MessageRequest<D> | null {
  try {
    if (!validateMessage<D>(message)) return null

    return {
      ...message,
      eid: normalizeEid(message?.eid),
      ts: Date.now(),
    }
  } catch {
    return null
  }
}

export function formatSuccess<T extends string, D = unknown>(msg: {
  eid?: string | number
  type?: T
  data: D
  status: Exclude<ResponseStatus, "error">
}) {
  const response = objectFilter(
    {
      status: msg.status,
      type: msg.type,
      data: msg.data,
      error: null,
      eid: normalizeEid(msg.eid),
      ts: Date.now(),
    },
    (value) => value !== undefined,
  ) as MessageSuccess<D>

  return JSON.stringify(response)
}

export function formatError<T extends string>(msg: {eid?: string | number; type?: T; error: string}) {
  const response = objectFilter(
    {
      status: "error",
      type: msg.type,
      data: null,
      error: msg.error,
      eid: normalizeEid(msg.eid),
      ts: Date.now(),
    },
    (value) => value !== undefined,
  ) as MessageError

  return JSON.stringify(response)
}
