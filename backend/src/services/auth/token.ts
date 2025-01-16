import { createJWT, refreshJWT } from "@/shared/jwt";
import type { User } from "@prisma/client";
import type { AuthTokens } from "@/types/auth";

export async function createTokens(user: User): Promise<AuthTokens> {
  const tokens = await createJWT(user);
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  return refreshJWT(refreshToken);
}
