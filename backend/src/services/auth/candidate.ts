import { prisma } from "@/core/db";
import { Errors } from "@/constants/errors";
import { ApiError } from "@/shared/errors/ApiError";
import { generateCode } from "@/shared/crypto";
import type { Candidate } from "@prisma/client";

export async function createCandidate(username: string): Promise<Candidate> {
  // Delete existing candidate if exists
  const existingCandidate = await prisma.candidate.findUnique({
    where: { username },
  });

  if (existingCandidate) {
    await prisma.candidate.delete({
      where: { username },
    });
  }

  // Create new candidate
  const code = generateCode();
  return prisma.candidate.create({
    data: {
      username,
      code,
      expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });
}

export async function validateCandidate(username: string, code: string): Promise<Candidate> {
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

export async function deleteCandidate(username: string): Promise<void> {
  await prisma.candidate.delete({
    where: { username },
  });
}
