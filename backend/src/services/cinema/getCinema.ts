import {prisma} from "@/core/db"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

export async function getCinema(cinemaId: string) {
  const cinema = await prisma.cinema.findUnique({
    where: {id: cinemaId},
    include: {
      seats: true,
    },
  })

  if (!cinema) {
    throw new ApiError(Errors.CINEMA_NOT_FOUND)
  }

  return cinema
}
