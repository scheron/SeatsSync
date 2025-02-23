<script setup lang="ts">
import {computed} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import {getSeatRowChar} from "@/shared/utils/hall"

const cinemaStore = useCinemaStore()
const hallName = computed(() => `${cinemaStore.activeHall?.name} ${cinemaStore.cinema?.name}`)
const seats = computed(() => cinemaStore.selectedSeats.map((seat) => `${getSeatRowChar(seat.row)}${seat.place}`).join(", "))
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-content/60 flex flex-col gap-2 text-sm">
      <div class="flex justify-between">
        <span class="">Hall</span>
        <span class="text-content font-bold">{{ hallName }}</span>
      </div>
      <div class="flex justify-between">
        <span class="">Seats</span>
        <span class="text-content font-bold">{{ seats.length ? seats : "-" }}</span>
      </div>
      <div class="flex justify-between">
        <span class="">Total</span>
        <span class="text-content font-bold">$30</span>
      </div>
    </div>

    <div class="ml-auto flex w-2/3 gap-2">
      <BaseButton variant="outline" @click="cinemaStore.onClearSelectedSeats">Cancel</BaseButton>
      <BaseButton variant="accent">Purchase</BaseButton>
    </div>
  </div>
</template>
