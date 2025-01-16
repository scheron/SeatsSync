import { prisma } from "@/core/db";
import { ApiError } from "@/shared/errors/ApiError";
import { Errors } from "@/constants/errors";

export async function getHall(hallId: string) {
  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
    include: {
      layout: true,
      settings: true,
    },
  });

  if (!hall) {
    throw new ApiError(Errors.HALL_NOT_FOUND);
  }

  return hall;
}
