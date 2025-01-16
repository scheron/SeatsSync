import { createJWT } from "@/shared/jwt";
import { logger } from "@/shared/logger";
import { validateCandidate, getUser, createUser } from "./auth.service";
import type { User } from "@prisma/client";

export async function login(username: string, code: string) {
  try {
    await validateCandidate(username, code);
    const user = await getUser(username);
    const tokens = await createJWT(user);
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (error) {
    logger.error(`Login failed for user ${username}:`, error);
    throw error;
  }
}

export async function register(username: string, code: string) {
  try {
    await validateCandidate(username, code);
    const user = await createUser(username);
    const tokens = await createJWT(user);
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (error) {
    logger.error(`Registration failed for user ${username}:`, error);
    throw error;
  }
}

export async function getStatus(user: User) {
  try {
    const currentUser = await getUser(user.username);
    return {
      user: currentUser,
    };
  } catch (error) {
    logger.error(`Failed to get status for user ${user.username}:`, error);
    throw error;
  }
}
