<script setup lang="ts">
import {computed, ref} from "vue"
import {calculateHallSize, createSeatsSchema} from "@/utils/hall"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import RowName from "./RowName.vue"
import SeatPlace from "./SeatPlace.vue"

import type {Seat} from "@seats-sync/types/cinema"

const props = withDefaults(defineProps<{seats: Seat[]}>(), {
  seats: () => [],
})
const emit = defineEmits<{"hover-seat": [Seat | null]; "select-seat": [Seat]}>()

const hoveredSeat = ref<{row: number; place: number} | null>(null)

const seatsSchema = computed(() => createSeatsSchema(props.seats))
const sizes = computed(() => calculateHallSize(props.seats))

let timeout: ReturnType<typeof setTimeout>

function onRowMouseMove(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement

  if (timeout) clearTimeout(timeout)
  if (!seatEl) {
    timeout = setTimeout(onRowMouseLeave, 50)
    return
  }

  const seatRow = Number(seatEl.dataset.row)
  const seatPlace = Number(seatEl.dataset.place)
  const seatId = Number(seatEl.dataset.seatId)

  hoveredSeat.value = {row: seatRow, place: seatPlace}

  const seat = props.seats.find(({id}) => id === seatId)
  if (!seat) return

  emit("hover-seat", seat)
}

function onRowMouseLeave() {
  hoveredSeat.value = null
  emit("hover-seat", null)
}

function onSeatClick(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement
  if (!seatEl) return

  const seatId = Number(seatEl.dataset.seatId)
  const seat = props.seats.find(({id}) => id === seatId)

  if (seat) emit("select-seat", seat)
}
</script>

<template>
  <div class="flex w-full my-auto flex-col items-center justify-center perspective-distant">
    <BaseIcon name="screen" class="text-content/60 h-20 w-full" />

    <div
      class="relative mt-4 cursor-default gap-1"
      :style="{width: sizes.width + 'px', height: sizes.height + 'px'}"
      @mousemove="onRowMouseMove"
      @mouseleave="onRowMouseLeave"
    >
      <div v-for="row in seatsSchema" :key="row[0].row" class="flex" :data-row="row[0].row" @click="onSeatClick">
        <SeatPlace v-for="seat in row" :key="seat.id" :seat="seat" :hovered="hoveredSeat?.row === seat.row && hoveredSeat?.place === seat.place" />
      </div>

      <template v-for="row in seatsSchema" :key="row[0].row">
        <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" left />
        <RowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat" />
      </template>
    </div>
  </div>
</template>
