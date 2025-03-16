export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";
export type NodeStrategy = "all" | "console" | "file";

export type LoggerOptions = {
  /** Enable or disable logging (default: true) */
  enabled?: boolean;
  /** Exclude log levels from output (default: none) */
  exclude?: LogLevel[];
  /** When true, include a stack trace with each log message (default: false) */
  stackTrace?: boolean;
  /** If true, show the full stack trace; otherwise, a condensed file:line info (default: true) */
  fullTrace?: boolean;
  /** If true, use styled output (CSS in browser, ANSI in Node) (default: false) */
  styled?: boolean;

  /** In Node, if provided, logs will be appended to this file */
  filePath?: string;
  /** In Node, if provided, logs will be written to the console or a file or both*/
  nodeStrategy?: NodeStrategy;
};

export interface LoggerStrategy {
  log(formatted: string, level: LogLevel, optionalParams: any[]): void;
}
