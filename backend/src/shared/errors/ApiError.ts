import {ErrorCode, SystemErrors} from "@/constants/errors"
import {logger} from "@/shared/logger"

export type ErrorDetails = Record<string, unknown>

export class ApiError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: ErrorDetails

  constructor(statusCode: number, code: ErrorCode, details?: ErrorDetails) {
    super(code)
    this.code = code
    this.statusCode = statusCode
    this.details = details

    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)

    this.logError()
  }

  private logError(): void {
    const errorContext = {
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
    }

    if (this.statusCode >= 500) {
      logger.error("Server error occurred", errorContext)
    } else if (this.statusCode >= 400) {
      logger.warn("Client error occurred", errorContext)
    } else {
      logger.info("Error occurred", errorContext)
    }
  }

  public toJSON(): object {
    return {
      error: this.code,
      ...(this.details && {details: this.details}),
    }
  }

  static badRequest(code: ErrorCode, details?: ErrorDetails): ApiError {
    return new ApiError(400, code, details)
  }

  static unauthorized(code: ErrorCode = SystemErrors.Unauthorized, details?: ErrorDetails): ApiError {
    return new ApiError(401, code, details)
  }

  static forbidden(code: ErrorCode = SystemErrors.Forbidden, details?: ErrorDetails): ApiError {
    return new ApiError(403, code, details)
  }

  static notFound(code: ErrorCode, details?: ErrorDetails): ApiError {
    return new ApiError(404, code, details)
  }

  static tooManyRequests(code: ErrorCode = SystemErrors.RateLimitExceeded, details?: ErrorDetails): ApiError {
    return new ApiError(429, code, details)
  }

  static internal(code: ErrorCode = SystemErrors.InternalServerError, details?: ErrorDetails): ApiError {
    return new ApiError(500, code, details)
  }

  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    const err = error as Error
    return ApiError.internal(SystemErrors.InternalServerError, {
      originalError: err.message,
      stack: err.stack,
    })
  }
}
