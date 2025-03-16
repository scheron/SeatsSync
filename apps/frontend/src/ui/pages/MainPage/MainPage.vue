<script setup lang="ts">
import {onMounted} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {SEAT_TYPES} from "@/constants/icons"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseAccordion from "@/ui/base/BaseAccordion"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"
import BasePopover from "@/ui/base/BasePopover.vue"
import Hall from "@/ui/sections/Hall"
import HallList from "@/ui/sections/HallList/HallList.vue"

import type {Seat, SeatTypeStats} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()

function calcSeatTypeReservation(name: string) {
  const seatType = cinemaStore.activeHall?.seat_types.find((seatType) => seatType.name === name)
  if (!seatType) return "0%"

  const percent = seatType.seats.RESERVED / seatType.seats_count
  return `${(percent * 100).toFixed(0)}%`
}

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

onMounted(() => {
  console.log(cinemaStore.activeHall)
  console.log(cinemaStore.activeCinema)
})
</script>

<template>
  <div aria-label="section" class="bg-primary-100 text-content flex size-full flex-col gap-2 p-4">
    <div aria-label="main" class="flex-1 grid grid-cols-[500px_1fr] gap-2">
      <div class="flex items-center gap-2 flex-col p-2">
        <div aria-label="header" class="flex flex-col w-full gap-2">
          <BasePopover>
            <template #trigger="{show}">
              <BaseButton icon="cinema" class="text-lg" @click="show">{{ cinemaStore.activeHall?.name }}</BaseButton>
            </template>

            <template #content>
              <div class="border-primary-400 bg-primary-100 flex flex-col rounded-lg border shadow-lg">
                <HallList />
              </div>
            </template>
          </BasePopover>
        </div>

        <BasePanel
          v-for="{name, seats} in groupSeatsByType(cinemaStore.activeHall?.seats || [])"
          :key="name"
          class="flex flex-col gap-2 w-full items-start"
        >
          <div class="flex w-full items-center justify-between text-accent px-2 py-1 gap-2 flex-wrap">
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
            >
              {{ getSeatRowChar(seat.row) }}{{ seat.place }}

              <template v-if="seat.status === 'RESERVED'">
                <div class="absolute w-[100%] h-0.5 bg-content/70 rotate-12"></div>
                <div class="absolute w-[100%] h-0.5 bg-content/70 -rotate-12"></div>
              </template>
            </BaseButton>
          </div>
        </BasePanel>
      </div>

      <Hall />
    </div>
  </div>
</template>
