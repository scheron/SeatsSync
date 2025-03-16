<script lang="ts" setup>
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"

import type {Seat} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()
const {open} = useReserveSeatModal()

function groupSeatsByType(seats: Seat[]) {
  return Object.entries(
    seats.reduce(
      (acc, seat) => {
        if (!acc[seat.seat_type.name]) acc[seat.seat_type.name] = []
        acc[seat.seat_type.name].push(seat)
        return acc
      },
      {} as Record<string, Seat[]>,
    ),
  ).map(([name, seats]) => ({name, seats}))
}

function calcSeatTypeReservation(name: string) {
  const seatType = cinemaStore.activeHall?.seat_types.find((seatType) => seatType.name === name)
  if (!seatType) return "0%"

  const percent = seatType.seats.RESERVED / seatType.seats_count
  return `${(percent * 100).toFixed(0)}%`
}
</script>

<template>
  <BasePanel
    v-for="{name, seats} in groupSeatsByType(cinemaStore.activeHall?.seats || [])"
    :key="name"
    class="flex flex-col gap-2 w-full items-start"
  >
    <div class="flex w-full items-center justify-between px-2 py-1 gap-2 flex-wrap">
      <span class="flex items-center gap-1">
        <BaseIcon :name="SEAT_TYPES[name]" class="size-4" />
        {{ name }}
      </span>

      <span class="flex items-center text-sm gap-1">
        {{ calcSeatTypeReservation(name) }}
        <BaseIcon name="ticket-filled" class="size-4" />
      </span>
    </div>

    <div class="flex w-full flex-wrap gap-1">
      <BaseButton
        v-for="seat in seats"
        :key="seat.id"
        class="relative"
        :icon="seat.status === 'RESERVED' ? 'ticket-filled' : 'ticket'"
        :disabled="seat.status === 'RESERVED'"
        size="sm"
        @click="open(seat)"
      >
        {{ getSeatRowChar(seat.row) }}{{ seat.place }}

        <template v-if="seat.status === 'RESERVED'">
          <div class="absolute w-full h-px bg-content/70 rotate-12"></div>
          <div class="absolute w-full h-px bg-content/70 -rotate-12"></div>
        </template>
      </BaseButton>
    </div>
  </BasePanel>
</template>
