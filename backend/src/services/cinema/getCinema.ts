import { prisma } from "@/core/db";
import { ApiError } from "@/shared/errors/ApiError";
import { Errors } from "@/constants/errors";

export async function getCinema(cinemaId: string) {
  const cinema = await prisma.cinema.findUnique({
    where: { id: cinemaId },
    include: {
      seats: true,
    },
  });

  if (!cinema) {
    throw new ApiError(Errors.CINEMA_NOT_FOUND);
  }

  return cinema;
}
