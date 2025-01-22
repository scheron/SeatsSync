import {UserService} from "@/services/user"
import {Errors} from "@/constants/errors"
import {logger} from "@/shared/logger"
import {sendError, sendSuccess} from "@/shared/messages/responses"

import type {Request, Response} from "express"

export async function authReset(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    UserService.deleteCandidate(username)
    sendSuccess(res, {})
  } catch (error) {
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
    logger.error("Failed to reset", {error: (error as Error).message, username})
  }
}
