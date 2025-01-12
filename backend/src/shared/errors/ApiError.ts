import {ErrorCode, SystemErrors} from "@/constants/errors"
import {logger} from "@/shared/logger"

export type ErrorDetails = Record<string, unknown>

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

  public toJSON(): object {
    return {
      error: this.code,
      ...(this.details && {details: this.details}),
    }
  }

  static badRequest(code: ErrorCode, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
  }

  static unauthorized(code: ErrorCode = SystemErrors.Unauthorized, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
  }

  static forbidden(code: ErrorCode = SystemErrors.Forbidden, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
  }

  static notFound(code: ErrorCode, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
  }

  static tooManyRequests(code: ErrorCode = SystemErrors.RateLimitExceeded, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
  }

  static internal(code: ErrorCode = SystemErrors.InternalServerError, details?: ErrorDetails): ApiError {
    return new ApiError(code, details)
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
