import {ref} from "vue"
import {tryOnBeforeUnmount, tryOnMounted} from "@vueuse/core"
import {defineStore} from "pinia"
import {deepMerge} from "@/utils/merges"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"

import type {Cinema, Hall, Seat} from "@/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const HALL_SUB_ID = "hall-sub"
  const CINEMAS_SUB_ID = "cinemas-sub"

  const themeStore = useThemeStore()
  const {subscribe, unsubscribe, cleanup} = useWebSocket()

  const cinemas = ref<Cinema[]>([])

  const activeCinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(null)
  const selectedSeats = ref<Seat[]>([])
  const selectionLimit = ref<number>(10)

  function onSelectCinema(cinema: Cinema) {
    activeCinema.value = cinema

    themeStore.setPrimaryColor(cinema.color)
  }

  function onSelectSeat(seat: Seat) {
    selectedSeats.value.push(seat)
  }

  function onClearSelectedSeats() {
    selectedSeats.value = []
  }

  function onSelectHall(hallId: Hall["id"]) {
    if (activeHall.value?.id === hallId) return
    selectedSeats.value = []

    unsubscribe(HALL_SUB_ID)

    subscribe({
      msg: {type: "hall.subscribe", data: {id: hallId}, eid: HALL_SUB_ID},
      onSnapshot: (data) => {
        activeHall.value = data
      },
      onUpdate: (data) => {
        activeHall.value = deepMerge(activeHall.value, data)
      },
    })
  }

  function onClearActiveHall() {
    activeHall.value = null
    selectedSeats.value = []
  }

  function onSubscribeCinemas() {
    unsubscribe(CINEMAS_SUB_ID)

    subscribe({
      msg: {type: "cinemas.subscribe", data: null, eid: CINEMAS_SUB_ID},
      onSnapshot: (data) => {
        cinemas.value = data
      },
      onUpdate: (data) => {
        cinemas.value.forEach((cinema) => {
          if (cinema.id !== data.id) return
          cinema = deepMerge(cinema, data)
        })
      },
    })
  }

  tryOnMounted(onSubscribeCinemas)

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
  }
})
