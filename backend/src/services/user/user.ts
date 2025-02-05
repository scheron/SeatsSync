import {LOGIN_ATTEMPTS_WINDOW, MAX_LOGIN_ATTEMPTS, RECOVERY_PHRASE_MIN_LENGTH, userModel, USERNAME_REGEX} from "@/model/user"
import {Errors} from "@/constants/errors"
import {hash, verify} from "@/shared/crypto"
import {ApiError} from "@/shared/errors/ApiError"
import {logger} from "@/shared/logger"

import type {User} from "@/model/user"

const loginAttempts = new Map<string, {count: number; resetAt: number}>()

export async function getUser(username: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    return await userModel.get(username)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function createUser(username: string, secret: string) {
  if (!USERNAME_REGEX.test(username)) throw new ApiError(Errors.InvalidUsername)

  try {
    const existingUser = await userModel.get(username)
    if (existingUser) throw new ApiError(Errors.UserAlreadyExists)

    const user = await userModel.create({username, secret})
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

    const updated = await userModel.update({...user, ...userData})
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
