<script setup lang="ts">
import {SEAT_TYPES} from "@/constants/icons"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseCard from "@/ui/base/BaseCard.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"
import BasePanel from "@/ui/base/BasePanel.vue"
import {useReserveSeatModal} from "@/ui/modals/ReserveSeat"
import ButtonSeat from "./fragments/ButtonSeat.vue"
import {calcSeatTypeReservation, groupSeatsByType} from "./helpers"

const cinemaStore = useCinemaStore()
const {open} = useReserveSeatModal()
</script>

<template>
  <BaseCard class="flex items-center gap-2 flex-col p-2">
    <BasePanel
      v-for="{name, seats} in groupSeatsByType(cinemaStore.activeHall?.seats || [])"
      :key="name"
      class="flex flex-col gap-2 w-full items-start"
    >
      <div class="flex w-full items-center justify-between px-2 py-1 gap-2 flex-wrap">
        <span class="flex items-center gap-1">
          <BaseIcon :name="SEAT_TYPES[name]" class="size-4" />
          {{ name }}
        </span>

        <span class="flex items-center text-sm gap-1">
          {{ calcSeatTypeReservation(cinemaStore.activeHall?.seat_types || [], name) }}
          <BaseIcon name="ticket-filled" class="size-4" />
        </span>
      </div>

      <div class="flex w-full flex-wrap gap-1">
        <ButtonSeat v-for="seat in seats" :key="seat.id" :seat="seat" @click="open(seat)" />
      </div>
    </BasePanel>
  </BaseCard>
</template>
