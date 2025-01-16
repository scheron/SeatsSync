import { createCandidate } from "@/services/auth/candidate";
import { logger } from "@/shared/logger";
import type { StartRequest, StartResponse } from "@/types/auth";

export async function start({ username }: StartRequest): Promise<StartResponse> {
  try {
    const candidate = await createCandidate(username);
    return { candidate };
  } catch (error) {
    logger.error(`Start auth failed for user ${username}:`, error);
    throw error;
  }
}


export async function start(req: Request<{}, {}, {username: string}>, res: Response) {
  const {username} = req.body

  try {
    const user = await getUser(username)
    if (user) return sendSuccess(res, {username: user.username, status: "user"})

    const candidate = createCandidate(username)
    sendSuccess(res, {qr_url: candidate.qr_url, username, status: "candidate"})
  } catch (error) {
    logger.error("Failed to auth start", {error: (error as Error).message, username})
    sendError(res, error.message ?? Errors.InternalServerError, error.message ? 400 : 500)
  }
}