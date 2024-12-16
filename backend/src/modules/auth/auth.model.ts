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
