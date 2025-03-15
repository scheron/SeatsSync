import type {EventMap, LogOperation, LogParams} from "./types"

export class DebugHelper<Events extends EventMap> {
  constructor(
    private debug: boolean,
    private fullTrace: boolean = true,
  ) {}

  private getStackTrace(): {full: string; file: string} {
    const error = new Error()
    const stackLines = error.stack?.split("\n") || []

    const callerLine =
      stackLines
        .find((line, index) => {
          if (index < 2) return false
          // A little hardcoded, but it's ok ¯\_(ツ)_/¯
          return !line.includes("DebugHelper") && !line.includes("EventEmitter") && !line.includes("EventSubscription")
        })
        ?.trim() ||
      stackLines[2]?.trim() ||
      ""

    const match = callerLine.match(/(?:at\s+.*\s+\()?([^()]+?:\d+:\d+)[)]?$/)
    if (!match) return {full: callerLine, file: callerLine}

    const pathWithLine = match[1]

    const fileMatch = pathWithLine.match(/([^/\\]+\.[^/\\]+:\d+:\d+)$/)
    if (!fileMatch) return {full: callerLine, file: pathWithLine}

    return {full: callerLine, file: fileMatch[1]}
  }

  log(operation: LogOperation, params: LogParams<Events>): void {
    if (!this.debug) return

    const stackTrace = this.getStackTrace()
    const eventName = params.event ? String(params.event) : ""

    const logParts = [`[EventEmitter]`, `${operation.toUpperCase()} ${eventName ? `${eventName}` : ""}`, "\n"]

    if (params.data) logParts.push("DATA ", params.data)
    if (params.message) logParts.push("MESSAGE ", params.message)

    logParts.push(`CAPTURED ${this.fullTrace ? stackTrace.full : stackTrace.file}`)

    console.log(...logParts)
  }
}
