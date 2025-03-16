<script setup lang="ts">
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseCard from "@/ui/base/BaseCard.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"
import ButtonHall from "./fragments/ButtonHall.vue"
import SelectCinema from "./fragments/SelectCinema.vue"

import type {HallInCinema} from "@seats-sync/types/cinema"

const cinemaStore = useCinemaStore()
const {hideAll} = useReserveSeatModal()

function onSelectHall(hall: HallInCinema) {
  if (hall.id === cinemaStore.activeHall?.id) return
  cinemaStore.onSelectHall(hall.id)
  hideAll()
}
</script>

<template>
  <BaseCard class="flex gap-2 w-full h-fit" :loading="!cinemaStore.activeCinema">
    <template v-if="cinemaStore.activeCinema">
      <SelectCinema :cinemas="cinemaStore.cinemas" :active-cinema="cinemaStore.activeCinema" @select-cinema="cinemaStore.onSelectCinema" />

      <div class="flex gap-2 overflow-x-auto items-center h-full flex-1">
        <ButtonHall
          v-for="hall in cinemaStore.activeCinema?.halls"
          :key="hall.id"
          :hall="hall"
          :active="hall.id === cinemaStore.activeHall?.id"
          @select-hall="onSelectHall"
        />
      </div>
    </template>
  </BaseCard>
</template>
