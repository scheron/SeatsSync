import {ref} from "vue"
import {defineStore} from "pinia"
import hall from "@/ui/features/cinemas/hall.json"

import type {Cinema, Hall, Seat} from "@/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const cinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(hall)
  const selectedSeats = ref<Seat[]>([])
  const selectionLimit = ref<number>(5)

  function onSelectSeat(seat: Seat) {
    selectedSeats.value.push(seat)
  }

  function onClearSelectedSeats() {
    selectedSeats.value = []
  }

  return {cinema, activeHall, selectedSeats, selectionLimit, onSelectSeat, onClearSelectedSeats}
})
