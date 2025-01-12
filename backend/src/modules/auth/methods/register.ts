import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"
import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {RegisterRequest, RegisterResponse} from "../types"

const userDb = new DB("user")

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const {username, secret} = data

  const existingUserResult = await userDb.findOne({username})
  if (existingUserResult.success) {
    throw new ApiError(Errors.UserAlreadyExists)
  }

  const createResult = await userDb.create({
    data: {
      username,
      secret,
    },
  })

  if (!createResult.success) {
    throw new ApiError(Errors.RegistrationFailed)
  }

  const user = createResult.data!
  const token = createJWT({username: user.username, id: user.id})
  const userData = {
    id: user.id,
    username: user.username,
  }

  // Notify subscribers about new user
  subscriptionManager.publish(`user:${user.id}`, userData, "user.login")

  return {
    token,
    user: userData,
  }
}
