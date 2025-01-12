import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {Cinema} from "./cinema.types"

const db = new DB("cinema")

export async function getAllCinemas(): Promise<Cinema[]> {
  try {
    const result = await db.findAll<Cinema>({
      include: {
        halls: {
          include: {
            seats: true,
          },
        },
      },
    })

    if (!result.success) {
      throw new ApiError(Errors.CinemaFetchFailed)
    }

    // Transform the data to include seatsCount
    return result.data!.map((cinema) => ({
      id: cinema.id,
      name: cinema.name,
      color: cinema.color,
      halls: cinema.halls.map((hall) => ({
        id: hall.id,
        name: hall.name,
        seatsCount: hall.seats.length,
      })),
    }))
  } catch (error) {
    throw new ApiError(Errors.CinemaFetchFailed)
  }
}

export async function getCinemaById(id: number): Promise<Cinema> {
  const cinema = await db.findOne<Cinema>({id})

  if (!cinema) {
    throw new ApiError(Errors.CinemaNotFound)
  }

  return cinema.data!
}

export async function createCinema(data: {name: string; color: string}): Promise<Cinema> {
  try {
    const result = await db.create<typeof data, Cinema>(data)
    return result.data!
  } catch (error) {
    throw new ApiError(Errors.CinemaCreateFailed)
  }
}

export async function updateCinema(id: number, data: {name?: string; color?: string}): Promise<Cinema> {
  try {
    const result = await db.update<typeof data, Cinema>(id, data)
    return result.data!
  } catch (error) {
    throw new ApiError(Errors.CinemaUpdateFailed)
  }
}

export async function deleteCinema(id: number): Promise<void> {
  try {
    await db.delete(id)
  } catch (error) {
    throw new ApiError(Errors.CinemaDeleteFailed)
  }
}
