type LogLevel = "INFO" | "WARN" | "ERROR"

export class Logger {
  constructor(private readonly debug = false) {}

  log(level: LogLevel, message: string, ...optionalParams: any[]): void {
    if (this.debug) {
      const timestamp = new Date().toLocaleTimeString()
      console.log(`[${timestamp}] [${level}]: ${message}`, ...optionalParams)
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log("INFO", message, ...optionalParams)
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log("WARN", message, ...optionalParams)
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log("ERROR", message, ...optionalParams)
  }
}
