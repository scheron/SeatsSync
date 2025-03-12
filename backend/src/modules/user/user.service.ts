import speakeasy from "speakeasy"
import {Errors} from "@/constants/errors"
import {hash, verify} from "@/shared/crypto"
import {ApiError} from "@/shared/errors/ApiError"
import {logger} from "@/shared/logger"
import {
  CODE_REGEX,
  LOGIN_ATTEMPTS_WINDOW,
  MAX_LOGIN_ATTEMPTS,
  MAX_VALIDATION_ATTEMPTS,
  USERNAME_REGEX,
  VALIDATION_ATTEMPTS_WINDOW,
} from "./user.constants"
import {UserModel} from "./user.model"
import {User} from "./user.types"

const loginAttempts = new Map<string, {count: number; resetAt: number}>()
const validationAttempts = new Map<string, {count: number; resetAt: number}>()

export async function getUser(username: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    return await UserModel.user.get(username)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function createUser(username: string, secret: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    const existingUser = await UserModel.user.get(username)
    if (existingUser) throw new ApiError(Errors.UserAlreadyExists)

    const user = await UserModel.user.create({username, secret})
    if (!user) throw new ApiError(Errors.InternalServerError)

    return user
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to create user", {error: error.message, username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function updateUser(userData: Partial<User>) {
  if (!userData.username || !USERNAME_REGEX.test(userData.username)) {
    throw new ApiError(Errors.InvalidUsername)
  }

  try {
    const user = await getUser(userData.username)
    if (!user) throw new ApiError(Errors.UserNotFound)

    if (userData.recovery_phrase) {
      userData.recovery_phrase = await hash(userData.recovery_phrase)
    }

    const updated = await UserModel.user.update({...user, ...userData})
    if (!updated) throw new ApiError(Errors.InternalServerError)

    logger.info("User updated successfully", {username: userData.username})
    return updated
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to update user", {error: error.message, username: userData.username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function validateUserCredentials(username: string, secret: string): Promise<boolean> {
  const now = Date.now()
  const attempts = loginAttempts.get(username)

  if (attempts && now < attempts.resetAt) {
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      throw new ApiError(Errors.TooManyLoginAttempts)
    }

    attempts.count++
  } else {
    loginAttempts.set(username, {
      count: 1,
      resetAt: now + LOGIN_ATTEMPTS_WINDOW,
    })
  }

  try {
    const user = await getUser(username)
    const isValid = await verify(secret, user.secret)

    if (!isValid) {
      logger.warn("Invalid credentials", {username})
      return false
    }

    loginAttempts.delete(username)
    return true
  } catch (error) {
    if (error instanceof ApiError) throw error
    logger.error("Failed to validate user credentials", {error: error.message, username})
    throw new ApiError(Errors.InternalServerError)
  }
}

export function createCandidate(username: string) {
  if (!USERNAME_REGEX.test(username)) {
    throw new ApiError(Errors.InvalidUsername)
  }

  try {
    if (UserModel.candidate.has(username)) {
      throw new ApiError(Errors.RegistrationInProgress)
    }

    const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`, length: 32})
    const candidate = {username, secret: secret.base32, qr_url: secret.otpauth_url, createdAt: Date.now()}

    UserModel.candidate.set(username, candidate)

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
    const candidate = UserModel.candidate.get(username)

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
    if (!UserModel.candidate.has(username)) throw new ApiError(Errors.RegistrationNotInProgress)

    UserModel.candidate.delete(username)
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
