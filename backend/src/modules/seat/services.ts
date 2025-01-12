import {Errors} from "@/constants/errors"
import {prisma} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {SeatType} from "./types"

export async function getSeatTypes(): Promise<SeatType[]> {
  try {
    const seatTypes = await prisma.seatType.findMany({
      include: {
        ticketTypes: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    })

    return seatTypes
  } catch (error) {
    throw new ApiError(500, Errors.SeatTypesFetchFailed)
  }
}
