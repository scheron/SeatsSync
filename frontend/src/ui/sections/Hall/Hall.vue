<script setup lang="ts">
import {computed, ref} from "vue"
import {toast} from "@/lib/toasts-lite"
import {calculateHallSize, createSeatsSchema} from "@/utils/hall"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseSelect from "@/ui/base/BaseSelect.vue"
import RowName from "./RowName.vue"
import SeatPlace from "./SeatPlace.vue"
import SeatsSchemeInfo from "./SeatsSchemeInfo.vue"

import type {Hall} from "@/types/cinema"

const cinemaStore = useCinemaStore()

const seatsSchema = computed(() => createSeatsSchema(cinemaStore.activeHall?.seats ?? []))
const sizes = computed(() => calculateHallSize(cinemaStore.activeHall?.seats ?? []))

const hoveredSeat = ref<{row: number; place: number} | null>(null)
const selectedSeatsIds = computed(() => new Set(cinemaStore.selectedSeats.map((seat) => seat.id)))
const availableHalls = computed(() => cinemaStore.cinema?.halls || [])

function onHallChange(hall: Hall) {
  cinemaStore.onSelectHall(hall)
}

function onRowMouseMove(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  if (seatEl) {
    const seatRow = Number(seatEl.dataset.row)
    const seatPlace = Number(seatEl.dataset.place)
    hoveredSeat.value = {row: seatRow, place: seatPlace}
  } else {
    hoveredSeat.value = null
  }
}

function onRowMouseLeave() {
  hoveredSeat.value = null
}

function onSeatClick(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  const seatId = Number(seatEl.dataset.seatId)
  const seatStatus = seatEl.dataset.status
  if (seatStatus === "occupied") return

  if (selectedSeatsIds.value.has(seatId)) {
    cinemaStore.selectedSeats = cinemaStore.selectedSeats.filter((seat) => seat.id !== seatId)
  } else {
    if (cinemaStore.selectionLimit && cinemaStore.selectedSeats.length >= cinemaStore.selectionLimit) {
      toast.error(`You can only select up to ${cinemaStore.selectionLimit} seats`, {id: "selection-limit"})
      return
    }

    const seat = cinemaStore.activeHall?.seats.find((seat) => seat.id === seatId)
    if (seat) cinemaStore.selectedSeats.push(seat)
  }
}
</script>

<template>
  <div v-if="cinemaStore.activeHall" class="flex size-full flex-col items-center gap-2">
    <div class="flex w-1/2 items-center justify-center">
      <BaseSelect
        :model-value="cinemaStore.activeHall"
        @update:model-value="onHallChange"
        :options="availableHalls"
        option-label="name"
        option-value="id"
        class="text-lg"
      />
    </div>

    <div class="flex size-full items-center justify-center rounded-md p-2">
      <div class="flex w-full flex-col items-center justify-center perspective-distant">
        <BaseIcon name="screen" class="text-content/60 h-20 w-full" />

        <div class="relative mt-4 gap-1" :style="{width: sizes.width + 'px', height: sizes.height + 'px'}">
          <div
            v-for="row in seatsSchema"
            :key="row[0].row"
            class="flex"
            :data-row="row[0].row"
            @mousemove="onRowMouseMove"
            @mouseleave="onRowMouseLeave"
            @click="onSeatClick"
          >
            <SeatPlace
              v-for="seat in row"
              :key="seat.id"
              :seat="seat"
              :hovered="hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place"
              :selected="selectedSeatsIds.has(seat.id)"
            />
          </div>

          <template v-for="row in seatsSchema" :key="row[0].row">
            <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" left />
            <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" />
          </template>
        </div>
      </div>
    </div>

    <SeatsSchemeInfo />
  </div>
  <div v-else class="flex size-full items-center justify-center">Please choose a cinema first</div>
</template>
