import speakeasy from "speakeasy"
import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {User} from "./types"

const db = new DB("user")

export async function createUser(user: User): Promise<User> {
  const result = await db.create<User, User>(user)

  if (!result.success) {
    logger.error({message: "Failed to create user", error: result.error})
    throw new Error("Failed to create user")
  }

  return result.data!
}

export async function updateUser(userData: Partial<User>) {
  const user = await findUser({username: userData.username})
  if (!user) return null

  const result = await db.update<typeof userData, User>(user.id, userData)

  if (!result.success) {
    logger.error({message: `Failed to update user ${userData.username}`, error: result.error})
    throw new Error(`Failed to update user ${userData.username}`)
  }

  return result.data!
}

export async function findUser({username}: {username: User["username"]}): Promise<User> {
  const result = await db.findOne<User>({username})

  if (!result.success) {
    logger.error(`Failed to find user ${username}`)
    throw new Error(`User ${username} not found`)
  }

  return result.data!
}

export async function loginUser(username: string, code: string) {
  const user = await findUser({username})
  if (!user) return null

  const isValid = speakeasy.totp.verify({secret: user.secret, encoding: "base32", token: code})
  return isValid ? user : null
}

export function createCandidate(username: string) {
  const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`})
  return {username, secret: secret.base32, qr_url: secret.otpauth_url, createdAt: Date.now()}
}

export async function registerCandidate({username, secret, code}: {username: string; secret: string; code: string}) {
  if (!username) {
    throw new Error("Username is required")
  }

  const isValid = speakeasy.totp.verify({secret, encoding: "base32", token: code, window: 1})

  if (!isValid) {
    throw new Error("Invalid token")
  }

  await createUser({username, secret})

  return true
}
