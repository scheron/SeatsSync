import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {defineStore} from "pinia"
import {useWebSocket} from "@/composables/useWebSocket"

import type {Cinema, Hall, Seat} from "@/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const SUB_ID = "hall-sub"

  const {subscribe, unsubscribe, cleanup} = useWebSocket()
  const cinema = ref<Cinema | null>(null)

  const activeHall = ref<Hall | null>(null)
  const selectedSeats = ref<Seat[]>([])
  const selectionLimit = ref<number>(5)

  function onSelectSeat(seat: Seat) {
    selectedSeats.value.push(seat)
  }

  function onClearSelectedSeats() {
    selectedSeats.value = []
  }

  function onSelectHall(hall: Hall) {
    unsubscribe(SUB_ID)

    subscribe({
      msg: {type: "hall.subscribe", data: {id: hall.id}, eid: SUB_ID},
      onSnapshot: (data) => {
        activeHall.value = data
      },
      onUpdate: (data) => {
        // activeHall.value = data
        console.log("update hall", data)
      },
    })
  }

  function onClearActiveHall() {
    activeHall.value = null
  }

  tryOnBeforeUnmount(() => cleanup())

  return {cinema, activeHall, selectedSeats, selectionLimit, onSelectSeat, onClearSelectedSeats, onSelectHall, onClearActiveHall}
})
