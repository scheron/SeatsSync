import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"
import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {LoginRequest, LoginResponse} from "../types"

const userDb = new DB("user")

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const {username, secret} = data

  const userResult = await userDb.findOne({username})
  if (!userResult.success) {
    throw new ApiError(Errors.InvalidCredentials)
  }

  const user = userResult.data!
  if (user.secret !== secret) {
    throw new ApiError(Errors.InvalidCredentials)
  }

  const token = createJWT({username: user.username, id: user.id})
  const userData = {
    id: user.id,
    username: user.username,
  }

  // Notify subscribers about user login
  subscriptionManager.publish(`user:${user.id}`, userData, "user.login")

  return {
    token,
    user: userData,
  }
}
