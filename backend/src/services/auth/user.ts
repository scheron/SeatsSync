import { prisma } from "@/core/db";
import { Errors } from "@/constants/errors";
import { ApiError } from "@/shared/errors/ApiError";
import { logger } from "@/shared/logger";
import type { User } from "@prisma/client";

export async function createUser(username: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new ApiError(Errors.USER_EXISTS);
  }

  return prisma.user.create({
    data: { username },
  });
}

export async function getUser(username: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ApiError(Errors.USER_NOT_FOUND);
  }

  return user;
}

export async function updateUser(username: string, data: { recovery_phrase?: string }): Promise<User> {
  try {
    return prisma.user.update({
      where: { username },
      data,
    });
  } catch (error) {
    logger.error(`Failed to update user ${username}:`, error);
    throw new ApiError(Errors.USER_NOT_FOUND);
  }
}
