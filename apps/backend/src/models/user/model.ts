import {DB} from "@/core/db"
import {logger} from "@/shared/lib/logger"

import type * as UserTypes from "./types"

class Candidate extends Map<string, UserTypes.Candidate> {
  constructor(private readonly candidateTTL = 5 * 60 * 1000) {
    super()
  }

  override set(key: string, value: UserTypes.Candidate): this {
    super.set(key, value)

    setTimeout(() => {
      if (this.has(key)) {
        this.delete(key)
        logger.info("Candidate registration expired", {username: key})
      }
    }, this.candidateTTL)

    return this
  }

  override delete(key: string): boolean {
    if (!super.has(key)) return false

    return super.delete(key)
  }
}

class User {
  constructor(private db: DB) {}

  async create(user: UserTypes.User): Promise<UserTypes.User | null> {
    const result = await this.db.create<UserTypes.User, UserTypes.User>(user)

    if (!result.success) {
      logger.error({message: "Failed to create user", error: result.error})
      return null
    }

    return user
  }

  async update(userData: Partial<UserTypes.User>): Promise<UserTypes.User | null> {
    const user = await this.get(userData.username)
    if (!user) return null

    const result = await this.db.update<typeof userData, UserTypes.User>(user.id, userData)

    if (!result.success) {
      logger.error({message: `Failed to update user ${userData.username}`, error: result.error})
      return null
    }

    return user
  }

  async get(username: UserTypes.User["username"]): Promise<UserTypes.User | null> {
    const result = await this.db.findOne<UserTypes.User>({
      where: {username},
    })

    return result.success ? result.data! : null
  }
}

export const UserModel = {
  user: new User(new DB("user")),
  candidate: new Candidate(),
}
