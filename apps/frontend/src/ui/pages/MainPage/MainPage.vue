<script setup lang="ts">
import {ref} from "vue"
import {useTooltip} from "@/composables/useTooltip"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseCard from "@/ui/base/BaseCard.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"
import SeatTooltip from "@/ui/tooltips/SeatTooltip.vue"
import PanelHallSelect from "./fragments/PanelHallSelect.vue"
import PanelSeatSelect from "./fragments/PanelSeatSelect.vue"
import Scheme from "./fragments/Scheme.vue"
import SchemeInfo from "./fragments/SchemeInfo.vue"
import {groupSeatsByType} from "./helpers"

import type {HallInCinema, Seat} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()
const {open, hideAll} = useReserveSeatModal()
const {isTooltipVisible, tooltipRef, showTooltip, hideTooltip} = useTooltip()

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

function onSelectHall(hall: HallInCinema) {
  if (hall.id === cinemaStore.activeHall?.id) return
  cinemaStore.onSelectHall(hall.id)
  hideAll()
}

function onSelectSeat(seat: Seat) {
  if (!seat || seat.status === "RESERVED") return
  open(seat)
}
</script>

<template>
  <section class="text-content flex size-full flex-col gap-3 p-3">
    <BaseCard class="flex gap-2 w-full h-fit" :loading="!cinemaStore.activeCinema">
      <PanelHallSelect
        v-if="cinemaStore.activeCinema"
        :cinemas="cinemaStore.cinemas"
        :active-cinema="cinemaStore.activeCinema"
        :active-hall="cinemaStore.activeHall"
        @select-hall="onSelectHall"
        @select-cinema="cinemaStore.onSelectCinema"
      />
    </BaseCard>

    <div class="flex-1 grid grid-cols-[500px_1fr] gap-3 overflow-auto">
      <BaseCard :loading="!cinemaStore.activeHall" class="flex items-center gap-2 flex-col p-2">
        <PanelSeatSelect
          v-for="{name, seats} in groupSeatsByType(cinemaStore.activeHall?.seats || [])"
          :key="name"
          :name="name"
          :seats="seats"
          :seat-types="cinemaStore.activeHall?.seat_types ?? []"
          @select-seat="open"
        />
      </BaseCard>

      <BaseCard :loading="!cinemaStore.activeHall" data-hall class="relative">
        <div v-if="cinemaStore.activeHall" class="flex size-full flex-col items-center justify-center gap-2">
          <div class="flex size-full flex-col items-center gap-6">
            <div class="flex flex-col items-center justify-center gap-2 w-full">
              <h3 class="text-content flex items-center gap-1"><BaseIcon name="cinema" class="size-4" /> {{ cinemaStore.activeCinema?.name }}</h3>
              <p class="text-content flex items-center gap-1"><BaseIcon name="hall" class="size-4" /> {{ cinemaStore.activeHall.name }}</p>
            </div>

            <Scheme :seats="cinemaStore.activeHall.seats" @hover-seat="onHoverSeat" @select-seat="onSelectSeat" />
            <SchemeInfo />
          </div>

          <SeatTooltip ref="tooltipRef" :tooltip-visible="isTooltipVisible" :seat="hoveredSeat" />
        </div>

        <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
      </BaseCard>
    </div>
  </section>
</template>
