import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"
import {User} from "@/shared/types"

import type {MessageHandler} from "@/shared/messages/types"
import type {LoginRequest, LoginResponse} from "./types"

const userDb = new DB("user")

export const login: MessageHandler<LoginRequest, LoginResponse> = async (data) => {
  const {username, secret} = data

  const userResult = await userDb.findOne<User>({username})
  if (!userResult.success) {
    throw new ApiError(Errors.InvalidCredentials)
  }

  const user = userResult.data!
  if (user.secret !== secret) {
    throw new ApiError(Errors.InvalidCredentials)
  }

  const token = createJWT({username: user.username, sub: user.id + ""})

  return {
    token,
    user: {
      id: user.id!,
      username: user.username,
    },
  }
}
