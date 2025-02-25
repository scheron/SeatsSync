import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {defineStore} from "pinia"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"

import type {Cinema, Hall, Seat} from "@/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const SUB_ID = "hall-sub"

  const themeStore = useThemeStore()
  const {subscribe, unsubscribe, cleanup} = useWebSocket()

  const cinemas = ref<Cinema[]>([])

  const activeCinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(null)
  const selectedSeats = ref<Seat[]>([])
  const selectionLimit = ref<number>(5)

  function onSelectCinema(cinema: Cinema) {
    activeCinema.value = cinema

    themeStore.setPrimaryColor(cinema.color)

    onSelectHall(cinema.halls[0])
  }

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

  function fetchCinemas() {
    subscribe<Cinema[], null>({
      msg: {type: "cinema.get_cinemas", data: null},
      isOnce: true,
      onResult: ({data}) => {
        console.log("cinemas", data)

        cinemas.value = data
        onSelectCinema(data[0])
      },
    })
  }

  tryOnBeforeUnmount(() => cleanup())

  return {
    cinemas,
    activeCinema,
    activeHall,
    selectedSeats,
    selectionLimit,

    onSelectCinema,
    onSelectSeat,
    onClearSelectedSeats,
    onSelectHall,
    onClearActiveHall,

    fetchCinemas,
  }
})
