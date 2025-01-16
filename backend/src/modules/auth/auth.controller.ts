import { Request, Response } from 'express';
import { Errors } from "@/constants/errors";
import { ApiError } from "@/shared/errors/ApiError";
import { createJWT, refreshJWT } from "@/shared/jwt";
import { logger } from "@/shared/logger";
import { sendError, sendSuccess } from "@/shared/messages/responses";
import { createCandidate, deleteCandidate, validateCandidate } from "./auth.service";
import { createUser, getUser, updateUser } from "./auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
};

export class AuthController {
  static async start(req: Request<{}, {}, {username: string}>, res: Response) {
    const { username } = req.body;
    try {
      const candidate = await createCandidate(username);
      return sendSuccess(res, { candidate });
    } catch (error) {
      if (error instanceof ApiError) {
        return sendError(res, error.code, error.message);
      }
      logger.error(error);
      return sendError(res, Errors.INTERNAL_ERROR);
    }
  }

  static async login(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
    const { username, code } = req.body;
    try {
      const candidate = await validateCandidate(username, code);
      const user = await getUser(username);
      const tokens = await createJWT(user);
      
      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { 
        user,
        accessToken: tokens.accessToken 
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return sendError(res, error.code, error.message);
      }
      logger.error(error);
      return sendError(res, Errors.INTERNAL_ERROR);
    }
  }

  static async register(req: Request<{}, {}, {username: string; code: string}>, res: Response) {
    const { username, code } = req.body;
    try {
      await validateCandidate(username, code);
      const user = await createUser(username);
      const tokens = await createJWT(user);
      
      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { 
        user,
        accessToken: tokens.accessToken 
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return sendError(res, error.code, error.message);
      }
      logger.error(error);
      return sendError(res, Errors.INTERNAL_ERROR);
    }
  }

  static async saveRecoveryPhrase(req: Request<{}, {}, {username: string; recovery_phrase: string}>, res: Response) {
    const { username, recovery_phrase } = req.body;
    try {
      const user = await updateUser(username, { recovery_phrase });
      return sendSuccess(res, { user });
    } catch (error) {
      if (error instanceof ApiError) {
        return sendError(res, error.code, error.message);
      }
      logger.error(error);
      return sendError(res, Errors.INTERNAL_ERROR);
    }
  }
}
