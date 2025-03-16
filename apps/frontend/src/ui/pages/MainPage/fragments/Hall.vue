<script setup lang="ts">
import {ref} from "vue"
import {useTooltip} from "@/composables/useTooltip"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"
import SeatTooltip from "@/ui/tooltips/SeatTooltip.vue"
import HallScheme from "./HallScheme.vue"
import SeatsSchemeInfo from "./SeatsSchemeInfo.vue"

import type {Seat} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()

const {isTooltipVisible, tooltipRef, showTooltip, hideTooltip} = useTooltip()
const {open} = useReserveSeatModal()

const hoveredSeat = ref<Seat | null>(null)

function onHoverSeat(seat: Seat | null) {
  if (!seat) {
    hoveredSeat.value = null
    hideTooltip()
    return
  }

  hoveredSeat.value = seat
  showTooltip()
}

function onSelectSeat(seat: Seat) {
  if (!seat || seat.status === "RESERVED") return
  open(seat)
}
</script>

<template>
  <div v-if="cinemaStore.activeHall" class="flex size-full flex-col items-center justify-center gap-2">
    <div class="flex size-full flex-col items-center gap-6">
      <div class="flex flex-col items-center justify-center gap-2 w-full">
        <h3 class="text-content flex items-center gap-1"><BaseIcon name="cinema" class="size-4" /> {{ cinemaStore.activeCinema?.name }}</h3>
        <p class="text-content flex items-center gap-1"><BaseIcon name="hall" class="size-4" /> {{ cinemaStore.activeHall.name }}</p>
      </div>

      <HallScheme :seats="cinemaStore.activeHall.seats" @hover-seat="onHoverSeat" @select-seat="onSelectSeat" />
      <SeatsSchemeInfo />
    </div>

    <SeatTooltip ref="tooltipRef" :tooltip-visible="isTooltipVisible" :seat="hoveredSeat" />
  </div>

  <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
</template>
