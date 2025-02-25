<script setup lang="ts">
import {computed} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"

const cinemaStore = useCinemaStore()
const hallName = computed(() => `${cinemaStore.activeHall?.name} ${cinemaStore.cinema?.name}`)
const seats = computed(() => cinemaStore.selectedSeats.map((seat) => `${getSeatRowChar(seat.row)}${seat.place}`).join(", "))
</script>

<template>
  <div v-if="cinemaStore.activeHall" class="flex flex-col gap-4">
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

  <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
</template>
