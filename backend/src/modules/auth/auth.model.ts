import speakeasy from "speakeasy"
import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {User} from "./auth.types"

const db = new DB("user")

export async function createUser(user: User): Promise<User> {
  const result = await db.create<User, User>(user)

  if (!result.success) {
    logger.error({message: "Failed to create user", error: result.error})
    throw new Error(result.error || "Failed to create user")
  }

  return result.data!
}

export async function findUser({username}: {username: User["username"]}): Promise<User> {
  const result = await db.findOne<User>({username})

  if (!result.success) {
    logger.error({message: `Failed to find user ${username}`, error: result.error})
    throw new Error(result.error || `User ${username} not found`)
  }

  return result.data!
}

export function createCandidate(username: string) {
  const secret = speakeasy.generateSecret({name: `SeatsSync ${username}`})
  return {username, secret: secret.base32, qr_url: secret.otpauth_url, createdAt: Date.now()}
}

export async function registerCandidate({username, secret, token}: {username: string; secret: string; token: string}) {
  if (!username) {
    throw new Error("Username is required")
  }

  const isValid = speakeasy.totp.verify({secret, encoding: "base32", token, window: 1})

  if (!isValid) {
    throw new Error("Registration failed")
  }

  console.log("Registered candidate", {
    username,
    secret,
    token,
  })

  // await createUser({username, secret, token: null, recovery_phrase: null})
  // res.json({otpauth_url: secret.otpauth_url, secret: secret.base32})
  // await createUser({username: candidate.username, secret: candidate.secret})
  // return true
}

export async function loginUser(username: string, token: string) {
  // const user = await findUserByUsername(username)
  // if (!user) return null
  // const isValid = speakeasy.totp.verify({secret: user.secret, encoding: "base32", token})
  // return isValid ? user : null
}
