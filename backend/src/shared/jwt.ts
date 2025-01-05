import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as string

export type TokenPayload = {username: string}
export const TOKEN_EXPIRATION = "5d"

export function createJWT(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: TOKEN_EXPIRATION})
}

export function verifyJWT(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}
