import type { LogLevel, LoggerStrategy, NodeStrategy } from "../types";

export class NodeLoggerStrategy implements LoggerStrategy {
  private allowFileLogging = false;
  private fileStream?: any;

  constructor(
    private styled: boolean,
    filePath?: string,
    private strategy: NodeStrategy = "all",
  ) {
    if (filePath) {
      import("fs")
        .then((fs) => {
          this.fileStream = fs.createWriteStream(filePath, { flags: "a" });
          this.allowFileLogging = true;
        })
        .catch((err) => {
          this.allowFileLogging = false;
          console.error("Failed to initialize file logging:", err);
        });
    }
  }

  private getANSICode(level: LogLevel): string {
    switch (level) {
      case "DEBUG":
        return "\x1b[90m"; // gray
      case "INFO":
        return "\x1b[34m"; // blue
      case "WARN":
        return "\x1b[33m"; // yellow/orange
      case "ERROR":
        return "\x1b[31m"; // red
      default:
        return "";
    }
  }

  private logToConsole(
    formatted: string,
    level: LogLevel,
    optionalParams: any[],
  ): void {
    if (this.styled) {
      const ansiColor = this.getANSICode(level);
      const reset = "\x1b[0m";
      console.log(`${ansiColor}${formatted}${reset}`, ...optionalParams);
    } else {
      console.log(formatted, ...optionalParams);
    }
  }

  private logToFile(formatted: string, optionalParams: any[]): void {
    if (this.fileStream && this.allowFileLogging) {
      this.fileStream.write(
        formatted +
          optionalParams.map((p) => JSON.stringify(p)).join(" ") +
          "\n",
      );
    }
  }

  log(formatted: string, level: LogLevel, optionalParams: any[]): void {
    try {
      if (this.strategy === "all" || this.strategy === "console") {
        this.logToConsole(formatted, level, optionalParams);
      }

      if (this.strategy === "all" || this.strategy === "file") {
        this.logToFile(formatted, optionalParams);
      }
    } catch (err) {
      console.error("Failed to log to file:", err);
    }
  }
}
