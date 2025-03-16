import type { LogLevel, LoggerStrategy } from "../types";

export class BrowserLoggerStrategy implements LoggerStrategy {
  constructor(private styled: boolean) {}

  private getStyle(level: LogLevel): string {
    switch (level) {
      case "DEBUG":
        return "color: gainsboro; font-weight: bold;";
      case "INFO":
        return "color: lightblue; font-weight: bold;";
      case "WARN":
        return "color: orange; font-weight: bold;";
      case "ERROR":
        return "color: lightcoral; font-weight: bold;";
      default:
        return "";
    }
  }

  log(formatted: string, level: LogLevel, optionalParams: any[]): void {
    try {
      if (this.styled && typeof window !== "undefined" && window.navigator) {
        console.log(`%c${formatted}`, this.getStyle(level), ...optionalParams);
      } else {
        console.log(formatted, ...optionalParams);
      }
    } catch (err) {
      console.error("Failed to log to console:", err);
    }
  }
}
