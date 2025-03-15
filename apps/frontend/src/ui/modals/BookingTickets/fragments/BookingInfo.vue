<script setup lang="ts">
import {ref} from "vue"
import {useTooltip} from "@/composables/useTooltip"
import SeatTooltip from "@/ui/tooltips/SeatTooltip.vue"
import BookingSeat from "./BookingSeat.vue"

import type {Cinema, Hall, Seat} from "@seats-sync/types/cinema"

const props = defineProps<{
  seats: Seat[]
  hall: Hall
  cinema: Cinema
}>()

const hoveredSeat = ref<Seat | null>(null)

const {isTooltipVisible, tooltipRef, showTooltip, hideTooltip} = useTooltip({hideDelay: 0})

function onSeatMouseMove(seat: Seat) {
  hoveredSeat.value = seat
  showTooltip()
}

async function onSeatMouseLeave() {
  await hideTooltip()
  hoveredSeat.value = null
}
</script>

<template>
  <div class="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-2">
    <div class="text-content/70 flex items-center justify-between">
      Cinema: <span class="text-content font-bold">{{ props.cinema.name }}</span>
    </div>
    <div class="text-content/70 flex items-center justify-between">
      Hall: <span class="text-content font-bold">{{ props.hall.name }}</span>
    </div>

    <div class="text-content/70 flex flex-col gap-2">
      Seats:

      <div class="grid grid-cols-2 gap-2">
        <BookingSeat v-for="seat in seats" :key="seat.id" :seat="seat" @mousemove="onSeatMouseMove(seat)" @mouseleave="onSeatMouseLeave" />
      </div>
    </div>

    <SeatTooltip ref="tooltipRef" :tooltip-visible="isTooltipVisible" :seat="hoveredSeat" />
  </div>
</template>
