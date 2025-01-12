import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {PricingRepository} from "../../pricing/repository/pricing.repository"
import {TicketTypeRepository} from "../../ticket-type/repository/ticket-type.repository"
import {SeatTypeRepository} from "../repository/seat-type.repository"

import type {SeatType} from "../types"

export class SeatTypeService {
  constructor(
    private seatTypeRepository: SeatTypeRepository,
    private ticketTypeRepository: TicketTypeRepository,
    private pricingRepository: PricingRepository,
  ) {}

  async getAllSeatTypes(): Promise<SeatType[]> {
    const seatTypesResult = await this.seatTypeRepository.findAll()
    if (!seatTypesResult.success) {
      throw new ApiError(Errors.SeatTypesFetchFailed)
    }

    const seatTypes = seatTypesResult.data!
    const seatTypePromises = seatTypes.map(async (seatType) => {
      const pricingResult = await this.pricingRepository.findBySeatTypeId(seatType.id)
      if (!pricingResult.success) {
        throw new ApiError(Errors.PricingFetchFailed)
      }

      const ticketTypeIds = [...new Set(pricingResult.data!.map((p) => p.ticketTypeId))]
      const ticketTypesResult = await this.ticketTypeRepository.findByIds(ticketTypeIds)
      if (!ticketTypesResult.success) {
        throw new ApiError(Errors.TicketTypesFetchFailed)
      }

      return {
        id: seatType.id,
        name: seatType.name,
        ticketTypes: ticketTypesResult.data!.map((ticketType) => {
          const pricing = pricingResult.data!.find((p) => p.ticketTypeId === ticketType.id && p.seatTypeId === seatType.id)
          return {
            id: ticketType.id,
            name: ticketType.name,
            price: pricing?.price || 0,
          }
        }),
      }
    })

    return Promise.all(seatTypePromises)
  }
}
