import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {HallRepository} from "../../hall/repository/hall.repository"
import {CinemaRepository} from "../repository/cinema.repository"

import type {Cinema} from "../types"

export class CinemaService {
  constructor(
    private cinemaRepository: CinemaRepository,
    private hallRepository: HallRepository,
  ) {}

  async getAllCinemas(): Promise<Cinema[]> {
    const cinemasResult = await this.cinemaRepository.findAll()
    if (!cinemasResult.success) {
      throw new ApiError(Errors.CinemaFetchFailed)
    }

    const cinemas = cinemasResult.data!

    // Get halls for each cinema
    const cinemaPromises = cinemas.map(async (cinema) => {
      const hallsResult = await this.hallRepository.findByCinemaId(cinema.id)
      if (!hallsResult.success) {
        throw new ApiError(Errors.HallFetchFailed)
      }

      return {
        id: cinema.id,
        name: cinema.name,
        color: cinema.color,
        halls: hallsResult.data!.map((hall) => ({
          id: hall.id,
          name: hall.name,
          seatsCount: hall._count?.seats || 0,
        })),
      }
    })

    return Promise.all(cinemaPromises)
  }

  async getCinemaById(id: number): Promise<Cinema> {
    const cinemaResult = await this.cinemaRepository.findById(id)
    if (!cinemaResult.success) {
      throw new ApiError(Errors.CinemaNotFound)
    }

    const cinema = cinemaResult.data!
    const hallsResult = await this.hallRepository.findByCinemaId(id)
    if (!hallsResult.success) {
      throw new ApiError(Errors.HallFetchFailed)
    }

    return {
      id: cinema.id,
      name: cinema.name,
      color: cinema.color,
      halls: hallsResult.data!.map((hall) => ({
        id: hall.id,
        name: hall.name,
        seatsCount: hall._count?.seats || 0,
      })),
    }
  }
}
