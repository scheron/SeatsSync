import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {User} from "./types"

class UserModel {
  constructor(private db: DB) {}

  async create(user: User): Promise<User | null> {
    const result = await this.db.create<User, User>(user)

    if (!result.success) {
      logger.error({message: "Failed to create user", error: result.error})
      return null
    }

    return user
  }

  async update(userData: Partial<User>): Promise<User | null> {
    const user = await this.get(userData.username)
    if (!user) return null

    const result = await this.db.update<typeof userData, User>(user.id, userData)

    if (!result.success) {
      logger.error({message: `Failed to update user ${userData.username}`, error: result.error})
      return null
    }

    return user
  }

  async get(username: User["username"]): Promise<User | null> {
    const result = await this.db.findOne<User>({
      where: {username},
    })
    console.log(result)

    return result.success ? result.data! : null
  }
}

export const userModel = new UserModel(new DB("user"))
