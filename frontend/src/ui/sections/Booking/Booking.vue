<script setup lang="ts">
import {computed, ref} from "vue"
import {getSeatRowChar} from "@/utils/hall"
import {useWebSocket} from "@/composables/useWebSocket"
import {useCinemaStore} from "@/stores/cinema/cinema.store"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseIcon from "@/ui/base/BaseIcon.vue"

const cinemaStore = useCinemaStore()

const isBooking = ref(false)
const seats = computed(() => cinemaStore.selectedSeats.map((seat) => `${getSeatRowChar(seat.row)}${seat.place}`).join(", "))
const total = computed(() => cinemaStore.selectedSeats.reduce((acc, seat) => acc + seat.seat_type.price, 0))
const {subscribe} = useWebSocket()

function onPurchase() {
  isBooking.value = true

  subscribe({
    msg: {
      type: "booking.purchase",
      data: {
        hall_id: cinemaStore.activeHall?.id,
        seat_ids: cinemaStore.selectedSeats.map((seat) => seat.id),
      },
    },
    onResult: () => {
      cinemaStore.onClearSelectedSeats()
      isBooking.value = false
    },
  })
}
</script>

<template>
  <div v-if="cinemaStore.activeHall" class="flex flex-col gap-4">
    <div class="text-content/60 flex flex-col gap-2 text-sm">
      <div class="flex justify-between">
        <span class="">Hall</span>
        <div class="text-content/60 flex items-center gap-2">
          <span>{{ cinemaStore.activeCinema?.name }}</span>
          <BaseIcon name="arrow-right-long" class="size-4" />
          <span class="text-content">{{ cinemaStore.activeHall?.name }}</span>
        </div>
      </div>
      <div class="flex justify-between">
        <span class="">Seats</span>
        <span class="text-content font-bold">{{ seats.length ? seats : "-" }}</span>
      </div>
      <div class="flex justify-between">
        <span class="">Total</span>
        <span class="text-content font-bold">${{ total }}</span>
      </div>
    </div>

    <div class="ml-auto flex w-2/3 gap-2">
      <BaseButton variant="outline" @click="cinemaStore.onClearSelectedSeats">Cancel</BaseButton>
      <BaseButton variant="accent" @click="onPurchase" :disabled="isBooking">Purchase</BaseButton>
    </div>
  </div>

  <div v-else class="flex size-full items-center justify-center">Please choose a hall first</div>
</template>
