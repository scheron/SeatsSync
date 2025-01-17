import winston from "winston"
import {Namespace} from "./types"

export enum LogMessageType {
  WS_INCOMING = "WS_INCOMING",
  WS_OUTGOING = "WS_OUTGOING",
  WS_ERROR = "WS_ERROR",
  WS_CONNECT = "WS_CONNECT",
  WS_DISCONNECT = "WS_DISCONNECT",
  WS_SERVER_ERROR = "WS_SERVER_ERROR",
}

export type WSLogData = {
  userId?: string
  namespace?: Namespace
  messageType?: string
  messageId?: string
  length?: number
  isHeartbeat?: boolean
  payload?: string
  error?: string
}

export type LogParams = {
  timestamp?: string
  message?: string
  level?: string
  type?: LogMessageType
  data?: WSLogData
  error?: Error | string
  stack?: string
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const

const MAX_PAYLOAD_LENGTH = 500
const DEFAULT_LOG_LEVEL = "info"
const LOG_TIMESTAMP_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ"

function truncatePayload(payload: string) {
  if (payload.length <= MAX_PAYLOAD_LENGTH) return payload
  return `${payload.slice(0, MAX_PAYLOAD_LENGTH)}... [truncated ${payload.length - MAX_PAYLOAD_LENGTH} chars]`
}

function formatError(error: Error | string) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }
  return String(error)
}

function formatWSMessage(params: LogParams) {
  const {timestamp, level, type, data} = params
  if (!data) return ""

  const parts = [
    timestamp,
    level?.toUpperCase(),
    type,
    data.namespace && `ns=${data.namespace}`,
    data.messageType && `type=${data.messageType}`,
    data.messageId && `id=${data.messageId}`,
    data.length && `len=${data.length}b`,
    data.error && `error=${formatError(data.error)}`,
  ].filter(Boolean)

  const base = parts.join(" | ")
  return data.payload ? `${base}\n  ${truncatePayload(data.payload)}` : base
}

const logFormat = winston.format.printf((params: any) => {
  try {
    const {timestamp, message, level, type, data, error, stack} = params

    if (type && Object.values(LogMessageType).includes(type)) {
      return formatWSMessage(params)
    }

    if (level === "error") {
      const errorParts = [timestamp, level.toUpperCase(), message, error && `error=${formatError(error)}`].filter(Boolean)
      return `${errorParts.join(" | ")}${stack ? `\n  ${stack}` : ""}`
    }

    const parts = [timestamp, level?.toUpperCase(), message]
    if (data && Object.keys(data).length > 0) {
      parts.push(JSON.stringify(data))
    }
    return parts.filter(Boolean).join(" | ")
  } catch (err) {
    return `${params.timestamp} | ERROR | Logger formatting error: ${err}`
  }
})

function createLogger() {
  const config: winston.LoggerOptions = {
    level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
    levels: LOG_LEVELS,
    format: winston.format.combine(winston.format.timestamp({format: LOG_TIMESTAMP_FORMAT}), winston.format.errors({stack: true}), logFormat),
    transports: [
      new winston.transports.Console({format: winston.format.colorize({all: true})}),
      new winston.transports.File({filename: "logs/error.log", level: "error"}),
      new winston.transports.File({filename: "logs/app.log"}),
    ],
  }

  return winston.createLogger(config)
}

export const logger = createLogger()
