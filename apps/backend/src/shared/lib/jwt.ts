import jwt from "jsonwebtoken"
import {ApiError} from "@/core/ws/utils/ApiError"
import {env} from "@/shared/constants/env"
import {logger} from "@/shared/lib/logger"
import {Errors} from "../../../../../packages/constants/src/errors"

if (!env.JWT_SECRET) {
  logger.error("JWT_SECRET is not set")
  process.exit(1)
}

const JWT_ALGORITHM = "HS256"
const TOKEN_EXPIRATION = "5d"

export type TokenPayload = {
  username: string
  sub: string
  iat?: number
  exp?: number
}

export function createJWT(payload: Omit<TokenPayload, "iat" | "exp">): string {
  try {
    return jwt.sign(payload, env.JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: TOKEN_EXPIRATION,
    })
  } catch (error) {
    logger.error("Error creating JWT", {error})
    throw new ApiError(Errors.InternalServerError)
  }
}

export function verifyJWT(token: string): TokenPayload | null {
  if (!token) {
    throw new ApiError(Errors.Unauthorized)
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    })

    if (typeof decoded === "object" && decoded !== null && "sub" in decoded && "username" in decoded) {
      return decoded as TokenPayload
    }

    throw new ApiError(Errors.TokenExpired)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(Errors.TokenExpired)
    }
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(Errors.TokenInvalid)
  }
}

export function decodeJWT(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload | null
  } catch {
    return null
  }
}

export function refreshJWT(token: string): string | null {
  try {
    const payload = verifyJWT(token)
    if (!payload) {
      throw new ApiError(Errors.TokenInvalid)
    }

    const {username, sub} = payload
    return createJWT({username, sub})
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    logger.error("Error refreshing JWT", {error})
    throw new ApiError(Errors.TokenInvalid)
  }
}
