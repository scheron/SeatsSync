import {Errors} from "@/constants/errors"
import {AuthService} from "@/services/auth"
import {createCandidate} from "@/services/auth/candidate"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await AuthService.getUser(username)
    if (user) return sendSuccess(res, {username: user.username, status: "user"})

    try {
      const candidate = createCandidate(username)
      sendSuccess(res, {qr_url: candidate.qr_url, username, status: "candidate"})
    } catch (error) {
      sendError(res, error.message ?? Errors.InternalServerError, 500)
      logger.error("Failed to create candidate", {error: (error as Error).message, username})
    }
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
    logger.error("Failed to get user", {error: (error as Error).message, username})
  }
}
