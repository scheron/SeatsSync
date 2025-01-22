import speakeasy from "speakeasy"
import {candidateModel, CODE_REGEX, MAX_VALIDATION_ATTEMPTS, USERNAME_REGEX, VALIDATION_ATTEMPTS_WINDOW} from "@/model/user"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {logger} from "@/shared/logger"

const validationAttempts = new Map<string, {count: number; resetAt: number}>()

export function createCandidate(username: string) {
  if (!USERNAME_REGEX.test(username)) {
    throw new ApiError(Errors.InvalidUsername)
  }

  try {
    if (candidateModel.has(username)) {
      throw new ApiError(Errors.RegistrationInProgress)
    }

    const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`, length: 32})
    const candidate = {username, secret: secret.base32, qr_url: secret.otpauth_url, createdAt: Date.now()}

    candidateModel.set(username, candidate)

    logger.info("Candidate created successfully", {username})
    return candidate
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to create candidate", {error: error.message, username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export function validateCandidate(username: string, code: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)
  if (!CODE_REGEX.test(code)) throw new ApiError(Errors.InvalidCode)

  const now = Date.now()
  const attempts = validationAttempts.get(username)

  if (attempts && now < attempts.resetAt) {
    if (attempts.count >= MAX_VALIDATION_ATTEMPTS) {
      throw new ApiError(Errors.TooManyValidationAttempts)
    }

    attempts.count++
  } else {
    validationAttempts.set(username, {count: 1, resetAt: now + VALIDATION_ATTEMPTS_WINDOW})
  }

  try {
    const candidate = candidateModel.get(username)

    if (!candidate) throw new ApiError(Errors.RegistrationNotInProgress)

    const isValid = isValidCode(candidate.secret, code)

    if (!isValid) {
      logger.warn("Invalid validation code", {username})
      throw new ApiError(Errors.InvalidCode)
    }

    validationAttempts.delete(username)

    return candidate
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to validate candidate", {error: error.message, username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export function deleteCandidate(username: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    if (!candidateModel.has(username)) throw new ApiError(Errors.RegistrationNotInProgress)

    candidateModel.delete(username)
    validationAttempts.delete(username)
    logger.info("Candidate deleted successfully", {username})
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to delete candidate", {error: error.message, username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export function isValidCode(secret: string, code: string) {
  try {
    return speakeasy.totp.verify({secret, encoding: "base32", token: code, window: 1})
  } catch (error) {
    logger.error("Failed to verify TOTP", {error: error.message})
    return false
  }
}
