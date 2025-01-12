import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {logger} from "@/shared/logger"
import {candidateModel} from "../model/candidate"

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/
const CODE_REGEX = /^\d{6}$/
const MAX_VALIDATION_ATTEMPTS = 3
const VALIDATION_ATTEMPTS_WINDOW = 5 * 60 * 1000 // 5 minutes

const validationAttempts = new Map<string, {count: number; resetAt: number}>()

export function createCandidate(username: string) {
  if (!USERNAME_REGEX.test(username)) {
    throw new ApiError(400, Errors.InvalidUsername)
  }

  try {
    if (candidateModel.has(username)) {
      throw new ApiError(403, Errors.RegistrationInProgress)
    }

    const candidate = candidateModel.create(username)
    candidateModel.set(username, candidate)

    logger.info("Candidate created successfully", {username})
    return candidate
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to create candidate", {error: error.message, username})
    throw new ApiError(500, Errors.InternalServerError)
  }
}

export function validateCandidate(username: string, code: string) {
  if (!USERNAME_REGEX.test(username)) {
    throw new ApiError(400, Errors.InvalidUsername)
  }

  if (!CODE_REGEX.test(code)) {
    throw new ApiError(400, Errors.InvalidCode)
  }

  const now = Date.now()
  const attempts = validationAttempts.get(username)

  if (attempts && now < attempts.resetAt) {
    if (attempts.count >= MAX_VALIDATION_ATTEMPTS) {
      throw new ApiError(429, Errors.TooManyValidationAttempts)
    }
    attempts.count++
  } else {
    validationAttempts.set(username, {
      count: 1,
      resetAt: now + VALIDATION_ATTEMPTS_WINDOW,
    })
  }

  try {
    const candidate = candidateModel.get(username)
    if (!candidate) {
      throw new ApiError(403, Errors.RegistrationNotInProgress)
    }

    if (now - candidate.createdAt > candidateModel.getCandidateTTL()) {
      candidateModel.delete(username)
      throw new ApiError(403, Errors.RegistrationExpired)
    }

    const isValid = candidateModel.isValid(candidate.secret, code)
    if (!isValid) {
      logger.warn("Invalid validation code", {username})
      throw new ApiError(403, Errors.InvalidCode)
    }

    validationAttempts.delete(username)
    return candidate
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to validate candidate", {error: error.message, username})
    throw new ApiError(500, Errors.InternalServerError)
  }
}

export function deleteCandidate(username: string) {
  if (!USERNAME_REGEX.test(username)) {
    throw new ApiError(400, Errors.InvalidUsername)
  }

  try {
    if (!candidateModel.has(username)) {
      throw new ApiError(405, Errors.RegistrationNotInProgress)
    }

    candidateModel.delete(username)
    validationAttempts.delete(username)
    logger.info("Candidate deleted successfully", {username})
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to delete candidate", {error: error.message, username})
    throw new ApiError(500, Errors.InternalServerError)
  }
}
