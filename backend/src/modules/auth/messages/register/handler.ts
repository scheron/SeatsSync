import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {createJWT} from "@/shared/jwt"

import type {MessageHandler} from "@/shared/messages/types"
import type {RegisterRequest, RegisterResponse} from "./types"

const userDb = new DB("user")

export const register: MessageHandler<RegisterRequest, RegisterResponse> = async (data) => {
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

  return {
    token,
    user: {
      id: user.id!,
      username: user.username,
    },
  }
}
