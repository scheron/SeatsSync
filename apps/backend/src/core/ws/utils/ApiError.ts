import {logger} from "@/lib/logger"

import type {ErrorCode} from "@seats-sync/constants/errors"

type ErrorDetails = Record<string, unknown>

export class ApiError extends Error {
  public readonly code: ErrorCode
  public readonly details?: ErrorDetails

  constructor(code: ErrorCode, details?: ErrorDetails) {
    super(code)
    this.code = code
    this.details = details

    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)

    this.logError()
  }

  private logError(): void {
    const errorContext = {
      code: this.code,
      details: this.details,
      stack: this.stack,
    }

    logger.info("Error occurred", errorContext)
  }
}
