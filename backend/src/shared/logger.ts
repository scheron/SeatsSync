import winston from "winston"

type Params = {
  timestamp?: string
  message?: any
  level?: string
  type?: string
  eid?: string
  data?: any
  stack?: string
  error?: string
}

const logFormat = winston.format.printf((params: Params) => {
  const {timestamp, message, level, type, eid, data, stack, error} = params

  const log = [timestamp, level.toUpperCase(), type, eid, error, message].filter(Boolean).join(" | ")
  if (level === "error") return log + stack
  return log + (data ? " | " + JSON.stringify(data) : "")
})

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.timestamp({format: "YYYY-MM-DDTHH:mm:ss.SSSZ"}),
    logFormat,
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({filename: "logs/app.log"})],
})
