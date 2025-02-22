<script setup lang="ts">
import {ref} from "vue"
import BaseIcon from "@/ui/common/base/BaseIcon.vue"
import {cn} from "@/shared/utils/tailwindcss"
import {calculateHallSize, createSeatsSchema, getSeatPlaceChar} from "./utils"

import type {Seat} from "@/types/cinema"

const props = defineProps<{
  seats: Seat[]
}>()

const seatsSchema = createSeatsSchema(props.seats)
const {width, height} = calculateHallSize(props.seats)

const hoveredSeat = ref<{row: number; place: number} | null>(null)
const selectedSeatsIds = ref(new Set<number>())

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
    selectedSeatsIds.value.delete(seatId)
  } else {
    selectedSeatsIds.value.add(seatId)
  }
}
</script>
<template>
  <div class="flex size-full items-center justify-center rounded-md p-2">
    <div class="flex w-full flex-col items-center justify-center perspective-distant">
      <BaseIcon name="screen" class="text-content/60 h-20 w-full" />

      <div class="relative mt-6 gap-1" :style="{width: width + 'px', height: height + 'px'}">
        <div
          v-for="(row, rowIndex) in seatsSchema"
          :key="rowIndex"
          class="flex"
          :data-row="row[0].row"
          @mousemove="onRowMouseMove"
          @mouseleave="onRowMouseLeave"
          @click="onSeatClick"
        >
          <div
            v-for="seat in row"
            :key="seat.id"
            class="absolute flex items-center justify-center rounded-md"
            :style="{
              width: seat.width + 'px',
              height: seat.height + 'px',
              left: seat.x + 'px',
              top: seat.y + 'px',
            }"
            :class="
              cn({
                'bg-content/50': seat.status === 'free',
                'bg-content/20': seat.status === 'occupied',
                'bg-accent': selectedSeatsIds.has(seat.id),
              })
            "
            data-seat
            :data-row="seat.row"
            :data-place="seat.place"
            :data-seat-id="seat.id"
            :data-status="seat.status"
          >
            <span
              v-if="seat.status === 'free'"
              class="pointer-events-none flex cursor-default items-center justify-center transition-opacity duration-200"
              :class="{
                'opacity-100': hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place,
                'opacity-0': !(hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place),
              }"
            >
              {{ seat.place }}
            </span>
          </div>
        </div>

        <template v-for="(row, rowIndex) in seatsSchema" :key="rowIndex">
          <span
            class="absolute transition-colors duration-200"
            :class="{
              'text-content font-bold': hoveredSeat?.row === row[0].row,
              'text-content/50': hoveredSeat?.row !== row[0].row,
            }"
            :style="{
              left: '-30px',
              top: row[0].y + row[0].height / 2 + 'px',
              transform: 'translateY(-50%)',
            }"
          >
            {{ getSeatPlaceChar(rowIndex) }}
          </span>

          <span
            class="absolute transition-colors duration-200"
            :class="{
              'text-content font-bold': hoveredSeat?.row === row[0].row,
              'text-content/50': hoveredSeat?.row !== row[0].row,
            }"
            :style="{
              right: '-30px',
              top: row[0].y + row[0].height / 2 + 'px',
              transform: 'translateY(-50%)',
            }"
          >
            {{ getSeatPlaceChar(rowIndex) }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
