import { LoggerOptions, LogLevel, LoggerStrategy } from "./types.js";
import { NodeLoggerStrategy } from "./strategies/node.js";
import { BrowserLoggerStrategy } from "./strategies/browser.js";

export class Logger {
  private stackTrace: boolean;
  private fullTrace: boolean;
  private strategy: LoggerStrategy;
  private exclude: LogLevel[];
  private styled: boolean;
  private enabled: boolean;

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.stackTrace = options.stackTrace ?? false;
    this.fullTrace = options.fullTrace ?? true;
    this.exclude = options.exclude ?? [];
    this.styled = options.styled || false;

    this.strategy = this.pickStrategy(options);
  }

  private pickStrategy(options: LoggerOptions): LoggerStrategy {
    const isNode =
      typeof process !== "undefined" &&
      process.versions != null &&
      process.versions.node != null;

    return isNode
      ? new NodeLoggerStrategy(
          this.styled,
          options.filePath,
          options.nodeStrategy,
        )
      : new BrowserLoggerStrategy(this.styled);
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    return this.enabled && !this.exclude.includes(messageLevel);
  }

  private getStackTrace(): { full: string; file: string } {
    const error = new Error();
    const stackLines = error.stack?.split("\n") || [];

    const callerLine =
      stackLines
        .find((line, index) => {
          if (index < 2) return false;
          return !line.includes("Logger") && !line.includes("getStackTrace");
        })
        ?.trim() ||
      stackLines[2]?.trim() ||
      "";

    const match = callerLine.match(/(?:at\s+.*\s+\()?([^()]+?:\d+:\d+)[)]?$/);
    if (!match) return { full: callerLine, file: callerLine };

    const pathWithLine = match[1];
    const fileMatch = pathWithLine.match(/([^/\\]+\.[^/\\]+:\d+:\d+)$/);
    if (!fileMatch) return { full: callerLine, file: pathWithLine };

    return { full: callerLine, file: fileMatch[1] };
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z/, "");
    let formatted = `[${timestamp}] [${level}]: ${message}`;

    if (this.stackTrace) {
      const stackTrace = this.getStackTrace();
      formatted += `\nStack Trace: ${this.fullTrace ? stackTrace.full : stackTrace.file}`;
    }
    return formatted;
  }

  log(level: LogLevel, message: string, ...optionalParams: any[]): void {
    if (!this.shouldLog(level)) return;
    const formatted = this.formatMessage(level, message);
    this.strategy.log(formatted, level, optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log("DEBUG", message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log("INFO", message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log("WARN", message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log("ERROR", message, ...optionalParams);
  }
}
