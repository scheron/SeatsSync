import { prisma } from "@/core/db";
import { Errors } from "@/constants/errors";
import { ApiError } from "@/shared/errors/ApiError";
import { generateCode } from "@/shared/crypto";
import { logger } from "@/shared/logger";

// Candidate Service
export async function createCandidate(username: string) {
  const existingCandidate = await prisma.candidate.findUnique({
    where: { username },
  });

  if (existingCandidate) {
    await prisma.candidate.delete({
      where: { username },
    });
  }

  const code = generateCode();
  const candidate = await prisma.candidate.create({
    data: {
      username,
      code,
      expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });

  return candidate;
}

export async function validateCandidate(username: string, code: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { username },
  });

  if (!candidate) {
    throw new ApiError(Errors.INVALID_CREDENTIALS);
  }

  if (candidate.code !== code) {
    throw new ApiError(Errors.INVALID_CREDENTIALS);
  }

  if (candidate.expires_at < new Date()) {
    throw new ApiError(Errors.CODE_EXPIRED);
  }

  return candidate;
}

export async function deleteCandidate(username: string) {
  return prisma.candidate.delete({
    where: { username },
  });
}

// User Service
export async function createUser(username: string) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new ApiError(Errors.USER_EXISTS);
  }

  const user = await prisma.user.create({
    data: {
      username,
    },
  });

  return user;
}

export async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ApiError(Errors.USER_NOT_FOUND);
  }

  return user;
}

export async function updateUser(username: string, data: { recovery_phrase?: string }) {
  try {
    const user = await prisma.user.update({
      where: { username },
      data,
    });
    return user;
  } catch (error) {
    logger.error(error);
    throw new ApiError(Errors.USER_NOT_FOUND);
  }
}
