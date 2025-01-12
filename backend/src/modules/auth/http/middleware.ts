import {Errors} from "@/constants/errors"
import {NextFunction, Request, Response} from "express"
import {verifyJWT} from "@/shared/jwt"
import {sendError} from "@/shared/messages/responses"
import {RateLimiter} from "@/shared/rateLimiter"

const authLimiter = new RateLimiter(100, 60_000)

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token

    if (!token) {
      return sendError(res, Errors.Unauthorized, 401)
    }

    const payload = verifyJWT(token)
    if (!payload) {
      res.clearCookie("token")
      return sendError(res, Errors.Unauthorized, 401)
    }

    req.user = payload
    next()
  } catch (error) {
    res.clearCookie("token")
    return sendError(res, Errors.InternalServerError, 500)
  }
}

export async function rateLimitAuth(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip

  if (authLimiter.isRateLimited(ip)) {
    return sendError(res, Errors.TooManyRequests, 429)
  }

  authLimiter.increment(ip)
  next()
}

export async function validateAuthBody(req: Request, res: Response, next: NextFunction) {
  const {username, code} = req.body

  if (!username || typeof username !== "string") {
    return sendError(res, Errors.RequiredUsername, 400)
  }

  if (username.length < 3 || username.length > 32) {
    return sendError(res, Errors.InvalidUsername, 400)
  }

  if (code !== undefined && (typeof code !== "string" || code.length !== 6)) {
    return sendError(res, Errors.InvalidCode, 400)
  }

  next()
}
