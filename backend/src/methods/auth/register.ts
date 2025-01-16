import { validateCandidate } from "@/services/auth/candidate";
import { createUser } from "@/services/auth/user";
import { createTokens } from "@/services/auth/token";
import { logger } from "@/shared/logger";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

export async function register({ username, code }: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Validate the registration code
    await validateCandidate(username, code);
    
    // Create new user
    const user = await createUser(username);
    
    // Create auth tokens
    const tokens = await createTokens(user);
    
    return {
      user,
      tokens,
    };
  } catch (error) {
    logger.error(`Registration failed for user ${username}:`, error);
    throw error;
  }
}
