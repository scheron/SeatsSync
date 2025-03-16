import { LogLevel, LoggerStrategy, NodeStrategy } from "../types";

export class NodeLoggerStrategy implements LoggerStrategy {
  private fileStream?: any;

  constructor(
    private styled: boolean,
    filePath?: string,
    private strategy: NodeStrategy = "all",
  ) {
    if (filePath) {
      try {
        import("fs").then((fs) => {
          this.fileStream = fs.createWriteStream(filePath, { flags: "a" });
        });
      } catch (err) {
        console.error("Failed to initialize file logging:", err);
      }
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

  log(formatted: string, level: LogLevel, optionalParams: any[]): void {
    try {
      if (this.strategy === "all" || this.strategy === "console") {
        if (this.styled) {
          const ansiColor = this.getANSICode(level);
          const reset = "\x1b[0m";
          console.log(`${ansiColor}${formatted}${reset}`, ...optionalParams);
        } else {
          console.log(formatted, ...optionalParams);
        }
      }

      if (this.strategy === "all" || this.strategy === "file") {
        if (this.fileStream)
          this.fileStream.write(
            formatted +
              optionalParams.map((p) => JSON.stringify(p)).join(" ") +
              "\n",
          );
      }
    } catch (err) {
      console.error("Failed to log to file:", err);
    }
  }
}
