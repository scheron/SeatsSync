import { validateCandidate } from "@/services/auth/candidate";
import { getUser } from "@/services/auth/user";
import { createTokens } from "@/services/auth/token";
import { logger } from "@/shared/logger";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login({ username, code }: LoginRequest): Promise<LoginResponse> {
  try {
    // Validate the login code
    await validateCandidate(username, code);
    
    // Get user data
    const user = await getUser(username);
    
    // Create auth tokens
    const tokens = await createTokens(user);
    
    return {
      user,
      tokens,
    };
  } catch (error) {
    logger.error(`Login failed for user ${username}:`, error);
    throw error;
  }
}
