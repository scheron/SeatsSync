<script setup lang="ts">
import {computed, ref} from "vue"
import {calculateHallSize, createSeatsSchema} from "@/utils/hall"
import {useTooltip} from "@/composables/useTooltip"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import SeatTooltip from "@/ui/tooltips/SeatTooltip.vue"
import RowName from "./RowName.vue"
import SeatPlace from "./SeatPlace.vue"
import SeatsSchemeInfo from "./SeatsSchemeInfo.vue"

import type {Seat} from "@/types/cinema"

const cinemaStore = useCinemaStore()

const {isTooltipVisible, tooltipRef, showTooltip, hideTooltip} = useTooltip()

const hoveredSeat = ref<{row: number; place: number} | null>(null)
const hoveredSeatFull = ref<Seat | null>(null)

const seatsSchema = computed(() => createSeatsSchema(cinemaStore.activeHall?.seats ?? []))
const sizes = computed(() => calculateHallSize(cinemaStore.activeHall?.seats ?? []))

function onRowMouseMove(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  if (!seatEl) {
    hideTooltip()
    return
  }

  const seatRow = Number(seatEl.dataset.row)
  const seatPlace = Number(seatEl.dataset.place)
  const seatId = Number(seatEl.dataset.seatId)

  hoveredSeat.value = {row: seatRow, place: seatPlace}

  const seat = cinemaStore.activeHall?.seats.find((s) => s.id === seatId)
  if (!seat) return

  hoveredSeatFull.value = seat
  showTooltip()
}

async function onRowMouseLeave() {
  await hideTooltip()
  hoveredSeat.value = null
  hoveredSeatFull.value = null
}

function onSeatClick(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  const seatId = Number(seatEl.dataset.seatId)
  const seatStatus = seatEl.dataset.status
  if (seatStatus === "OCCUPIED") return

  cinemaStore.onSelectSeat(seatId)
}
</script>

<template>
  <div v-if="cinemaStore.activeHall" class="flex size-full flex-col items-center justify-center gap-2">
    <div class="flex size-full flex-col items-center justify-center gap-6">
      <div class="flex w-full flex-col items-center justify-center perspective-distant">
        <BaseIcon name="screen" class="text-content/60 h-20 w-full" />

        <div class="relative mt-4 cursor-default gap-1" :style="{width: sizes.width + 'px', height: sizes.height + 'px'}">
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
              :selected="cinemaStore.isSeatSelected(seat.id)"
            />
          </div>

          <template v-for="row in seatsSchema" :key="row[0].row">
            <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" left />
            <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" />
          </template>
        </div>
      </div>

      <SeatsSchemeInfo />
    </div>

    <SeatTooltip ref="tooltipRef" :tooltip-visible="isTooltipVisible" :seat="hoveredSeatFull" />
  </div>

  <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
</template>
