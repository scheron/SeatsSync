import {ApiError} from "./errors/ApiError"
import {logger} from "./logger"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import {AuthErrors} from "@/constants/errors"

dotenv.config()

if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET is not set")
  process.exit(1)
}

const JWT_SECRET = process.env.JWT_SECRET
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
    return jwt.sign(payload, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: TOKEN_EXPIRATION,
    })
  } catch (error) {
    logger.error("Error creating JWT", {error})
    throw ApiError.internal()
  }
}

export function verifyJWT(token: string): TokenPayload | null {
  if (!token) {
    throw ApiError.unauthorized(AuthErrors.TokenMissing)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    })

    if (typeof decoded === "object" && decoded !== null && "sub" in decoded && "username" in decoded) {
      return decoded as TokenPayload
    }

    throw ApiError.unauthorized(AuthErrors.TokenInvalid)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized(AuthErrors.TokenExpired)
    }
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError.unauthorized(AuthErrors.TokenInvalid)
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
      throw ApiError.unauthorized(AuthErrors.TokenInvalid)
    }

    const {username, sub} = payload
    return createJWT({username, sub})
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    logger.error("Error refreshing JWT", {error})
    throw ApiError.unauthorized(AuthErrors.TokenInvalid)
  }
}
