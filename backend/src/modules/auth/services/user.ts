import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {userModel} from "../model/user"
import {User} from "../types"

export async function getUser(username: string) {
  const user = await userModel.get(username)
  if (!user) throw new ApiError(404, Errors.UserNotFound)
  return user
}

export async function createUser(username: string, secret: string) {
  const user = await userModel.create({username, secret})
  if (!user) throw new ApiError(500, Errors.InternalError)
  return user
}

export async function updateUser(userData: Partial<User>) {
  const user = await getUser(userData.username)
  if (!user) throw new ApiError(404, Errors.UserNotFound)

  const updated = await userModel.update({...user, ...userData})
  if (!updated) throw new ApiError(500, Errors.InternalError)

  return updated
}
