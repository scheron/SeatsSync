<script setup lang="ts">
import {ref} from "vue"
import {useRouter} from "vue-router"
import {invoke, until} from "@vueuse/core"
import {useCinemaStore} from "@/stores/cinema"
import BaseCard from "@/ui/base/BaseCard.vue"
import PanelHallSelect from "@/ui/common/PanelHallSelect.vue"
import {useReserveSeatModal} from "@/ui/popovers/modals/ReserveSeat"
import SeatsSelection from "./fragments/SeatsSelection.vue"
import {groupSeatsByType} from "./helpers"

import type {Cinema, HallInCinema, Seat} from "@seats-sync/types/cinema"

const router = useRouter()
const cinemaStore = useCinemaStore()

const {isOpened, open, close} = useReserveSeatModal()

const hoveredSeat = ref<Seat | null>(null)

function onHoverSeat(seat: Seat | null) {
  if (isOpened.value) {
    hoveredSeat.value = null
    return
  }
  hoveredSeat.value = seat
}

function onSelectCinema(cinema: Cinema) {
  cinemaStore.onSelectCinema(cinema)
  cinemaStore.onSelectHall(cinema.halls[0].id)
}

function onSelectHall(hall: HallInCinema) {
  if (hall.id === cinemaStore.activeHall?.id) return
  cinemaStore.onSelectHall(hall.id)
  close()
}

invoke(async () => {
  await until(() => cinemaStore.isCinemaLoaded).toBeTruthy()
  router.routeLoaded()
})
</script>

<template>
  <section class="text-content flex size-full flex-col gap-3">
    <div class="px-3 pt-3">
      <BaseCard class="flex w-full h-fit" :loading="!cinemaStore.activeCinema">
        <PanelHallSelect
          v-if="cinemaStore.activeCinema"
          :cinemas="cinemaStore.cinemas"
          :active-cinema="cinemaStore.activeCinema"
          :active-hall="cinemaStore.activeHall"
          @select-hall="onSelectHall"
          @select-cinema="onSelectCinema"
        />
      </BaseCard>
    </div>

    <div class="flex-1 flex items-center justify-center overflow-auto px-3 pb-3">
      <BaseCard :loading="!cinemaStore.activeHall" class="flex items-center gap-2 flex-col p-2">
        <SeatsSelection
          v-for="{name, seats} in groupSeatsByType(cinemaStore.activeHall?.seats || [])"
          :key="name"
          :name="name"
          :seats="seats"
          :seat-types="cinemaStore.activeHall?.seat_types ?? []"
          @select-seat="open(cinemaStore.activeHall?.id, $event)"
          @hover-seat="onHoverSeat"
        />
      </BaseCard>
    </div>
  </section>
</template>
