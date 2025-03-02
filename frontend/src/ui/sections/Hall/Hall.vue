<script setup lang="ts">
import {computed, ref} from "vue"
import {toast} from "@/lib/toasts-lite"
import {calculateHallSize, createSeatsSchema} from "@/utils/hall"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BaseTransitions from "@/ui/base/BaseTransitions.vue"
import RowName from "./RowName.vue"
import SeatPlace from "./SeatPlace.vue"
import SeatsSchemeInfo from "./SeatsSchemeInfo.vue"
import SeatTooltip from "./SeatTooltip.vue"

import type {Seat} from "@/types/cinema"

const cinemaStore = useCinemaStore()

const seatsSchema = computed(() => createSeatsSchema(cinemaStore.activeHall?.seats ?? []))
const sizes = computed(() => calculateHallSize(cinemaStore.activeHall?.seats ?? []))

const hoveredSeat = ref<{row: number; place: number} | null>(null)
const hoveredSeatFull = ref<Seat | null>(null)
const selectedSeatsIds = computed(() => new Set(cinemaStore.selectedSeats.map((seat) => seat.id)))

const showSeatTooltip = ref(false)

const mousePosition = ref({x: 0, y: 0})
const tooltipElement = ref<HTMLElement | null>(null)

function onContainerMouseMove(e: MouseEvent) {
  mousePosition.value = {x: e.clientX, y: e.clientY}

  updateTooltipPosition()
}

function updateTooltipPosition() {
  if (showSeatTooltip.value && tooltipElement.value) {
    const tooltip = tooltipElement.value

    tooltip.style.position = "fixed"
    tooltip.style.left = `${mousePosition.value.x}px`
    tooltip.style.top = `${mousePosition.value.y - 20}px`
    tooltip.style.transform = "translate(-50%, -100%)"
    tooltip.style.zIndex = "9999"
  }
}

let timeout: NodeJS.Timeout | null = null

function onRowMouseMove(e: MouseEvent) {
  if (timeout) clearTimeout(timeout)
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  if (seatEl) {
    const seatRow = Number(seatEl.dataset.row)
    const seatPlace = Number(seatEl.dataset.place)
    const seatId = Number(seatEl.dataset.seatId)

    hoveredSeat.value = {row: seatRow, place: seatPlace}

    const seat = cinemaStore.activeHall?.seats.find((s) => s.id === seatId)
    if (seat) {
      hoveredSeatFull.value = seat
      showSeatTooltip.value = true

      requestAnimationFrame(updateTooltipPosition)
    }
  } else {
    timeout = setTimeout(() => {
      hoveredSeat.value = null
      hoveredSeatFull.value = null
      showSeatTooltip.value = false
    }, 200)
  }
}

function onRowMouseLeave() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    hoveredSeat.value = null
    hoveredSeatFull.value = null
    showSeatTooltip.value = false
  }, 200)
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
  <div v-if="cinemaStore.activeHall" class="flex size-full flex-col items-center justify-center gap-2">
    <div class="flex size-full items-center justify-center rounded-md p-2">
      <div class="flex w-full flex-col items-center justify-center perspective-distant">
        <BaseIcon name="screen" class="text-content/60 h-20 w-full" />

        <div
          class="relative mt-4 cursor-default gap-1"
          :style="{width: sizes.width + 'px', height: sizes.height + 'px'}"
          @mousemove="onContainerMouseMove"
        >
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

    <Teleport to="body">
      <BaseTransitions name="fade">
        <div
          v-if="showSeatTooltip && hoveredSeatFull"
          ref="tooltipElement"
          class="pointer-events-none fixed"
          style="z-index: 9999; will-change: transform"
        >
          <SeatTooltip :seat="hoveredSeatFull" />
        </div>
      </BaseTransitions>
    </Teleport>
  </div>
  <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
</template>
