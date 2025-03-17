<script setup lang="ts">
import {computed, watch} from "vue"
import {calculateHallSize, createSeatsSchema} from "@/utils/hall"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import SchemeRowName from "./SchemeRowName.vue"
import SchemeSeat from "./SchemeSeat.vue"

import type {Seat} from "@seats-sync/types/cinema"

const props = withDefaults(defineProps<{seats: Seat[]; stopHover?: boolean; hoveredSeat?: Seat | null}>(), {
  seats: () => [],
  hoveredSeat: null,
})
const emit = defineEmits<{"hover-seat": [Seat | null]; "select-seat": [Seat]}>()

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

  if (props.stopHover) return

  const seatId = Number(seatEl.dataset.seatId)
  const seat = props.seats.find(({id}) => id === seatId)
  if (!seat) return

  emit("hover-seat", seat)
}

function onRowMouseLeave() {
  emit("hover-seat", null)
}

function onSeatClick(e: MouseEvent) {
  const seatEl = (e.target as HTMLElement).closest("[data-seat]") as HTMLElement
  if (!seatEl) return

  const seatId = Number(seatEl.dataset.seatId)
  const seat = props.seats.find(({id}) => id === seatId)

  if (seat) emit("select-seat", seat)
}

watch(() => props.stopHover, onRowMouseLeave)
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
        <SchemeSeat
          v-for="seat in row"
          :key="seat.id"
          :seat="seat"
          :hovered="hoveredSeat?.id === seat.id"
          data-seat
          :data-row="seat.row"
          :data-place="seat.place"
          :data-seat-id="seat.id"
          :data-status="seat.status"
        />
      </div>

      <template v-for="row in seatsSchema" :key="row[0].row">
        <SchemeRowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat ? {row: hoveredSeat.row, place: hoveredSeat.place} : null" left />
        <SchemeRowName :row="row" :rowIndex="row[0].row" :hoveredSeat="hoveredSeat ? {row: hoveredSeat.row, place: hoveredSeat.place} : null" />
      </template>
    </div>
  </div>
</template>
