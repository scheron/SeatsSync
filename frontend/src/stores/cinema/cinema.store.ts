import {computed, ref} from "vue"
import {tryOnBeforeUnmount, tryOnMounted} from "@vueuse/core"
import {defineStore} from "pinia"
import {toast} from "@/lib/toasts-lite"
import {deepMerge} from "@/utils/merges"
import {useWebSocket} from "@/composables/useWebSocket"
import {useThemeStore} from "@/stores/theme"

import type {Cinema, Hall, Seat} from "@/types/cinema"

export const useCinemaStore = defineStore("cinema", () => {
  const HALL_SUB_ID = "hall-sub"
  const CINEMAS_SUB_ID = "cinemas-sub"
  const SELECTION_LIMIT = 10

  const themeStore = useThemeStore()
  const {subscribe, unsubscribe, cleanup} = useWebSocket()

  const cinemas = ref<Cinema[]>([])

  const activeCinema = ref<Cinema | null>(null)
  const activeHall = ref<Hall | null>(null)
  const selectedSeats = ref<Map<Seat["id"], Seat>>(new Map())

  function onSelectCinema(cinema: Cinema) {
    activeCinema.value = cinema

    themeStore.setPrimaryColor(cinema.color)
  }

  function onSelectSeat(seatId: Seat["id"]) {
    if (selectedSeats.value.has(seatId)) {
      selectedSeats.value.delete(seatId)
    } else {
      if (selectedSeats.value.size >= SELECTION_LIMIT) {
        toast.error(`You can only select up to ${SELECTION_LIMIT} seats`, {id: "selection-limit"})
        return
      }
    }

    const seat = activeHall.value?.seats.find((seat) => seat.id === seatId)
    if (seat) selectedSeats.value.set(seatId, seat)
  }

  function onClearSelectedSeats() {
    selectedSeats.value.clear()
  }

  function isSeatSelected(seatId: Seat["id"]) {
    return selectedSeats.value.has(seatId)
  }

  function onSelectHall(hallId: Hall["id"]) {
    if (activeHall.value?.id === hallId) return
    selectedSeats.value.clear()

    unsubscribe(HALL_SUB_ID)

    subscribe({
      msg: {type: "hall.subscribe", data: {id: hallId}, eid: HALL_SUB_ID},
      onSnapshot: (data) => {
        activeHall.value = data
      },
      onUpdate: (data) => {
        if (activeHall.value?.id !== data.id) return
        activeHall.value = deepMerge(activeHall.value, data)
        if (!activeHall.value) return

        activeHall.value.seats.forEach((seat) => {
          if (selectedSeats.value.has(seat.id) && seat.status === "occupied") {
            selectedSeats.value.delete(seat.id)
          }
        })
      },
    })
  }

  function onClearActiveHall() {
    activeHall.value = null
    selectedSeats.value.clear()
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

    selectedSeats: computed(() => Array.from(selectedSeats.value.values())),
    onSelectSeat,
    isSeatSelected,
    onClearSelectedSeats,

    onSelectCinema,

    onSelectHall,
    onClearActiveHall,
  }
})
