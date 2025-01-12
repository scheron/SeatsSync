import {Errors} from "@/constants/errors"
import {DB} from "@/core/db/db"
import {ApiError} from "@/shared/errors/ApiError"
import {CinemaRepository} from "../repository/cinema.repository"

import type {Cinema} from "../types"

export class CinemaService {
  private repository: CinemaRepository

  constructor() {
    this.repository = new CinemaRepository()
  }

  async getCinemas(): Promise<Cinema[]> {
    const result = await this.repository.findAllWithHalls()
    if (!result.success) {
      throw new ApiError(Errors.CinemaFetchFailed)
    }
    return result.data!
  }

  async getCinemaById(id: number): Promise<Cinema> {
    const result = await this.repository.findByIdWithHalls(id)
    if (!result.success) {
      throw new ApiError(Errors.CinemaNotFound)
    }
    return result.data!
  }

  async createCinema(data: Partial<Cinema>): Promise<Cinema> {
    const result = await this.repository.create(data)
    if (!result.success) {
      throw new ApiError(Errors.CinemaCreateFailed)
    }
    return result.data!
  }

  async updateCinema(id: number, data: Partial<Cinema>): Promise<Cinema> {
    const result = await this.repository.update(id, data)
    if (!result.success) {
      throw new ApiError(Errors.CinemaNotFound)
    }
    return result.data!
  }

  async deleteCinema(id: number): Promise<void> {
    const result = await this.repository.delete(id)
    if (!result.success) {
      throw new ApiError(Errors.CinemaNotFound)
    }
  }
}

export const cinemaService = new CinemaService()
