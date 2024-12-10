import winston from "winston"

const logFormat = winston.format.printf(({timestamp, level, message}) => {
  return `${timestamp} | ${level.toUpperCase()} | ${message}`
})

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp({format: "YYYY-MM-DDTHH:mm:ss.SSSZ"}), logFormat),
  transports: [new winston.transports.Console(), new winston.transports.File({filename: "logs/app.log"})],
})
