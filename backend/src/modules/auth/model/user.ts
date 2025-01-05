import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {User} from "../types"

class UserModel {
  constructor(private db: DB) {}

  async create(user: User): Promise<boolean> {
    const result = await this.db.create<User, User>(user)

    if (!result.success) {
      logger.error({message: "Failed to create user", error: result.error})
      return false
    }

    return true
  }

  async update(userData: Partial<User>): Promise<boolean> {
    const user = await this.get(userData.username)
    if (!user) return false

    const result = await this.db.update<typeof userData, User>(user.id, userData)

    if (!result.success) {
      logger.error({message: `Failed to update user ${userData.username}`, error: result.error})
      return false
    }

    return true
  }

  async get(username: User["username"]): Promise<User> {
    const result = await this.db.findOne<User>({username})

    if (!result.success) {
      logger.error(`Failed to find user ${username}`)
      return null
    }

    return result.data!
  }
}

export const userModel = new UserModel(new DB("user"))
